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

      return c.json({ ok: true, migrated: false, reason: "column exists" });
    } catch (err) {
      console.error("migrations POST error", err);
      return c.json({ error: String(err) }, 500);
    }
  });

  return r;
}
