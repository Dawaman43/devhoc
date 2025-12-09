import { Hono } from "hono";
import type { Env } from "../index";

export function migrationsRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  // Run lightweight migrations (non-destructive) on demand.
  r.post("/run", async (c) => {
    try {
      // Inspect likes table columns
      const info = await c.env.DB.prepare("PRAGMA table_info('likes')").all();
      const cols = (info.results ?? []).map((r: any) => r.name);

      if (!cols.includes("emoji")) {
        await c.env.DB.prepare("ALTER TABLE likes ADD COLUMN emoji TEXT").run();
        return c.json({ ok: true, migrated: true, added: "emoji" });
      }

      // Ensure teams tables exist (idempotent)
      const teamInfo = await c.env.DB.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='teams'"
      ).first();
      if (!teamInfo) {
        await c.env.DB.prepare(
          `CREATE TABLE IF NOT EXISTS teams (
             id TEXT PRIMARY KEY,
             name TEXT NOT NULL,
             slug TEXT UNIQUE NOT NULL,
             description TEXT,
             owner_id TEXT,
             created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
           )`
        ).run();
        await c.env.DB.prepare(
          "CREATE INDEX IF NOT EXISTS idx_teams_owner ON teams(owner_id)"
        ).run();
      }

      const tmInfo = await c.env.DB.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='team_members'"
      ).first();
      if (!tmInfo) {
        await c.env.DB.prepare(
          `CREATE TABLE IF NOT EXISTS team_members (
             id TEXT PRIMARY KEY,
             team_id TEXT NOT NULL,
             user_id TEXT NOT NULL,
             role TEXT DEFAULT 'member',
             created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
             UNIQUE(team_id, user_id)
           )`
        ).run();
        await c.env.DB.prepare(
          "CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id)"
        ).run();
        await c.env.DB.prepare(
          "CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id)"
        ).run();
      }

      return c.json({
        ok: true,
        migrated: false,
        note: "likes column exists; ensured teams tables",
      });
    } catch (err) {
      console.error("migrations POST error", err);
      return c.json({ error: String(err) }, 500);
    }
  });

  // Add username column to users and populate unique usernames if missing
  r.post("/users/add-username", async (c) => {
    try {
      const info = await c.env.DB.prepare("PRAGMA table_info('users')").all();
      const cols = (info.results ?? []).map((r: any) => r.name);
      if (!cols.includes("username")) {
        await c.env.DB.prepare(
          "ALTER TABLE users ADD COLUMN username TEXT"
        ).run();
      }

      // Ensure unique index exists (will enforce uniqueness)
      await c.env.DB.prepare(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username)"
      ).run();

      // Populate missing usernames
      const rows = await c.env.DB.prepare(
        "SELECT id, name, email, username FROM users WHERE username IS NULL OR TRIM(username) = ''"
      ).all();
      const results = rows.results ?? [];
      for (const r of results) {
        const id = r.id as string;
        const name = String(r.name || "") as string;
        const email = String(r.email || "") as string;

        // generate base username from name or email local part
        const sanitize = (s: string) =>
          s
            .toLowerCase()
            .replace(/[^a-z0-9._-]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 28);

        let base = sanitize(name) || sanitize(email.split("@")[0]) || "user";
        if (!base) base = "user";

        let candidate = base;
        let suffix = 0;
        // ensure uniqueness
        while (true) {
          const exists = await c.env.DB.prepare(
            "SELECT id FROM users WHERE username = ? LIMIT 1"
          )
            .bind(candidate)
            .first();
          if (!exists) break;
          suffix += 1;
          candidate = `${base}-${suffix}`;
        }

        await c.env.DB.prepare("UPDATE users SET username = ? WHERE id = ?")
          .bind(candidate, id)
          .run();
      }

      return c.json({ ok: true, updated: (results || []).length });
    } catch (err) {
      console.error("add-username migration error", err);
      return c.json({ error: String(err) }, 500);
    }
  });

  // Seed a default admin user if missing
  r.post("/seed/admin", async (c) => {
    try {
      const email = "admin@gmail.com";
      const existing = await c.env.DB.prepare(
        "SELECT id FROM users WHERE email = ?"
      )
        .bind(email)
        .first();
      if (existing) {
        return c.json({ ok: true, seeded: false, note: "admin exists" });
      }

      const name = "Admin";
      const password = "12345678";
      const salt = crypto.randomUUID();
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
      );
      const bits = await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          hash: "SHA-256",
          salt: enc.encode(salt),
          iterations: 100_000,
        },
        keyMaterial,
        256
      );
      const bytes = new Uint8Array(bits);
      let binary = "";
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      // Use global btoa if available
      const hash =
        typeof btoa === "function"
          ? btoa(binary)
          : Buffer.from(bytes).toString("base64");
      const password_hash = `${salt}:${hash}`;
      const id = crypto.randomUUID();
      const username = "admin";
      await c.env.DB.prepare(
        "INSERT INTO users (id, email, password_hash, name, username, role) VALUES (?, ?, ?, ?, ?, 'ADMIN')"
      )
        .bind(id, email, password_hash, name, username)
        .run();

      return c.json({ ok: true, seeded: true, id, email });
    } catch (err) {
      console.error("seed admin error", err);
      return c.json({ error: String(err) }, 500);
    }
  });

  // Ensure verified column exists on users (idempotent)
  r.post("/users/add-verified", async (c) => {
    try {
      const info = await c.env.DB.prepare("PRAGMA table_info('users')").all();
      const cols = (info.results ?? []).map((r: any) => r.name);
      if (!cols.includes("verified")) {
        await c.env.DB.prepare(
          "ALTER TABLE users ADD COLUMN verified INTEGER DEFAULT 0"
        ).run();
      }
      return c.json({ ok: true });
    } catch (err) {
      console.error("add-verified migration error", err);
      return c.json({ error: String(err) }, 500);
    }
  });

  return r;
}
