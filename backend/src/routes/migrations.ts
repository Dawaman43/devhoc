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

  return r;
}
