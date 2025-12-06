import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../index";

const likeSchema = z.object({
  targetType: z.enum(["post", "comment"]),
  targetId: z.string(),
  emoji: z.string().optional(),
});

export function likesRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  // Toggle like (create if none, remove if exists)
  r.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = likeSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const { targetType, targetId, emoji } = parsed.data;
    const uid = ((c as any).user?.id as string) ?? "";
    if (!uid) return c.json({ error: "authentication required" }, 401);

    const existing = await c.env.DB.prepare(
      "SELECT id, emoji FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?"
    )
      .bind(uid, targetType, targetId)
      .first<{ id: string; emoji?: string }>();

    if (existing) {
      // If emoji provided and different, update emoji (change reaction)
      if (emoji && existing.emoji !== emoji) {
        await c.env.DB.prepare("UPDATE likes SET emoji = ? WHERE id = ?")
          .bind(emoji, existing.id)
          .run();
        return c.json({ ok: true, action: "updated", id: existing.id, emoji });
      }
      // Otherwise toggle off (remove)
      await c.env.DB.prepare("DELETE FROM likes WHERE id = ?")
        .bind(existing.id)
        .run();
      return c.json({ ok: true, action: "removed" });
    }

    const id = crypto.randomUUID();
    await c.env.DB.prepare(
      "INSERT INTO likes (id, user_id, target_type, target_id, emoji) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(id, uid, targetType, targetId, emoji ?? null)
      .run();
    return c.json({ ok: true, action: "created", id, emoji: emoji ?? null });
  });

  // Get like count for a target
  r.get("/count", async (c) => {
    const targetType = c.req.query("targetType");
    const targetId = c.req.query("targetId");
    if (!targetType || !targetId)
      return c.json({ error: "targetType and targetId required" }, 400);
    const total = await c.env.DB.prepare(
      "SELECT COUNT(1) as likes FROM likes WHERE target_type = ? AND target_id = ?"
    )
      .bind(targetType, targetId)
      .first<{ likes: number }>();

    const rows = await c.env.DB.prepare(
      "SELECT emoji, COUNT(1) as cnt FROM likes WHERE target_type = ? AND target_id = ? GROUP BY emoji ORDER BY cnt DESC"
    )
      .bind(targetType, targetId)
      .all<{ emoji?: string; cnt: number }>();

    const breakdown: Record<string, number> = {};
    for (const r of rows.results ?? []) {
      const key = r.emoji ?? "like";
      breakdown[key] = r.cnt;
    }

    return c.json({ likes: total?.likes ?? 0, breakdown });
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
