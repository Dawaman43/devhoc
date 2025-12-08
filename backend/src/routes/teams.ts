import { Hono } from "hono";
import type { Env } from "../index";

type TeamRow = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  owner_id?: string | null;
  created_at: string;
};

const mapTeamRow = (row: TeamRow) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description ?? undefined,
  ownerId: row.owner_id ?? undefined,
  createdAt: row.created_at,
});

export function teamsRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  // List teams with optional limit
  r.get("/", async (c) => {
    const limit = parseInt(String(c.req.query("limit") || "50")) || 50;
    const rows = await c.env.DB.prepare(
      `SELECT t.id, t.name, t.slug, t.description, t.owner_id, t.created_at,
              COUNT(tm.user_id) as memberCount
         FROM teams t
         LEFT JOIN team_members tm ON tm.team_id = t.id
         GROUP BY t.id
         ORDER BY memberCount DESC, t.created_at DESC
         LIMIT ?`
    )
      .bind(String(limit))
      .all<TeamRow & { memberCount: number }>();

    const items = (rows.results ?? []).map((row) => ({
      ...mapTeamRow(row),
      members: row.memberCount ?? 0,
    }));
    return c.json({ items });
  });

  // Create a team (owner optional)
  r.post("/", async (c) => {
    try {
      const body = await c.req.json();
      const name = String(body.name || "").trim();
      const description = body.description
        ? String(body.description).trim()
        : null;
      if (!name) return c.json({ error: "missing name" }, 400);

      const id = crypto.randomUUID();
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const owner = (c as any).user?.id ?? null;

      await c.env.DB.prepare(
        "INSERT INTO teams (id, name, slug, description, owner_id) VALUES (?, ?, ?, ?, ?)"
      )
        .bind(id, name, slug, description, owner)
        .run();

      // Optionally add owner as member
      if (owner) {
        try {
          const mid = crypto.randomUUID();
          await c.env.DB.prepare(
            "INSERT OR IGNORE INTO team_members (id, team_id, user_id) VALUES (?, ?, ?)"
          )
            .bind(mid, id, owner)
            .run();
        } catch {}
      }

      return c.json({ ok: true, id });
    } catch (err) {
      console.error("create team error", err);
      return c.json({ error: String(err) }, 500);
    }
  });

  // Get single team
  r.get("/:teamId", async (c) => {
    const { teamId } = c.req.param();
    const row = await c.env.DB.prepare(
      `SELECT t.id, t.name, t.slug, t.description, t.owner_id, t.created_at,
              COUNT(tm.user_id) as memberCount
         FROM teams t
         LEFT JOIN team_members tm ON tm.team_id = t.id
         WHERE t.id = ?
         GROUP BY t.id`
    )
      .bind(teamId)
      .first<TeamRow & { memberCount: number }>();
    if (!row) return c.json({ error: "team not found" }, 404);
    return c.json({ ...mapTeamRow(row), members: row.memberCount ?? 0 });
  });

  // Join a team (authenticated)
  r.post("/:teamId/join", async (c) => {
    const user = (c as any).user as { id: string } | undefined;
    if (!user?.id) return c.json({ error: "missing auth" }, 401);
    const { teamId } = c.req.param();
    try {
      const id = crypto.randomUUID();
      await c.env.DB.prepare(
        "INSERT OR IGNORE INTO team_members (id, team_id, user_id) VALUES (?, ?, ?)"
      )
        .bind(id, teamId, user.id)
        .run();
      return c.json({ ok: true });
    } catch (err) {
      console.error("join team error", err);
      return c.json({ error: String(err) }, 500);
    }
  });

  // List members
  r.get("/:teamId/members", async (c) => {
    const { teamId } = c.req.param();
    const rows = await c.env.DB.prepare(
      `SELECT tm.user_id AS id, COALESCE(u.name, tm.user_id) AS name, u.avatar_url AS avatarUrl
         FROM team_members tm
         LEFT JOIN users u ON u.id = tm.user_id
         WHERE tm.team_id = ?
         ORDER BY tm.created_at ASC
         LIMIT 100`
    )
      .bind(teamId)
      .all<{ id: string; name: string; avatarUrl?: string | null }>();
    return c.json({ items: rows.results ?? [] });
  });

  return r;
}
