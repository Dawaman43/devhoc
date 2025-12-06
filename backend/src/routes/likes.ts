import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../index";

const likeSchema = z.object({
  targetType: z.enum(["post", "comment"]),
  targetId: z.string(),
});

export function likesRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  // Toggle like (create if none, remove if exists)
  r.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = likeSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const { targetType, targetId } = parsed.data;
    const uid = ((c as any).user?.id as string) ?? "";
    if (!uid) return c.json({ error: "authentication required" }, 401);

    const existing = await c.env.DB.prepare(
      "SELECT id FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?"
    )
      .bind(uid, targetType, targetId)
      .first<{ id: string }>();

    if (existing) {
      await c.env.DB.prepare("DELETE FROM likes WHERE id = ?")
        .bind(existing.id)
        .run();
      return c.json({ ok: true, action: "removed" });
    }

    const id = crypto.randomUUID();
    await c.env.DB.prepare(
      "INSERT INTO likes (id, user_id, target_type, target_id) VALUES (?, ?, ?, ?)"
    )
      .bind(id, uid, targetType, targetId)
      .run();
    return c.json({ ok: true, action: "created", id });
  });

  // Get like count for a target
  r.get("/count", async (c) => {
    const targetType = c.req.query("targetType");
    const targetId = c.req.query("targetId");
    if (!targetType || !targetId)
      return c.json({ error: "targetType and targetId required" }, 400);
    const result = await c.env.DB.prepare(
      "SELECT COUNT(1) as likes FROM likes WHERE target_type = ? AND target_id = ?"
    )
      .bind(targetType, targetId)
      .first<{ likes: number }>();
    return c.json({ likes: result?.likes ?? 0 });
  });

  // Get whether current user liked the target
  r.get("/my-like", async (c) => {
    const targetType = c.req.query("targetType");
    const targetId = c.req.query("targetId");
    const uid = ((c as any).user?.id as string) ?? "";
    if (!uid) return c.json({ liked: false });
    if (!targetType || !targetId)
      return c.json({ error: "targetType and targetId required" }, 400);
    const like = await c.env.DB.prepare(
      "SELECT id FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?"
    )
      .bind(uid, targetType, targetId)
      .first<{ id: string }>();
    return c.json({ liked: !!like });
  });

  return r;
}
