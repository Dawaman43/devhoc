import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../index";

const voteSchema = z.object({
  targetType: z.enum(["post", "comment"]),
  targetId: z.string(),
  delta: z.enum(["up", "down"]),
  userId: z.string().optional(),
});

export function votesRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  r.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const { targetType, targetId, delta } = parsed.data;
    const uid = ((c as any).user?.id as string) ?? "";
    if (!uid) {
      return c.json({ error: "authentication required" }, 401);
    }
    const value = delta === "up" ? 1 : -1;

    // Check if user already voted on this target
    const existing = await c.env.DB.prepare(
      "SELECT id, value FROM votes WHERE user_id = ? AND target_type = ? AND target_id = ?"
    )
      .bind(uid, targetType, targetId)
      .first<{ id: string; value: number }>();

    if (existing) {
      // If same vote, remove it (toggle off)
      if (existing.value === value) {
        await c.env.DB.prepare("DELETE FROM votes WHERE id = ?")
          .bind(existing.id)
          .run();
        return c.json({ ok: true, action: "removed", value: 0 });
      }
      // If different vote, update it
      await c.env.DB.prepare("UPDATE votes SET value = ? WHERE id = ?")
        .bind(value, existing.id)
        .run();
      return c.json({ ok: true, action: "updated", id: existing.id, value });
    }

    // No existing vote, create new
    const id = crypto.randomUUID();
    await c.env.DB.prepare(
      "INSERT INTO votes (id, user_id, target_type, target_id, value) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(id, uid, targetType, targetId, value)
      .run();
    return c.json({ ok: true, action: "created", id, value });
  });

  // Get vote counts for a target
  r.get("/count", async (c) => {
    const targetType = c.req.query("targetType");
    const targetId = c.req.query("targetId");
    if (!targetType || !targetId) {
      return c.json({ error: "targetType and targetId required" }, 400);
    }
    const result = await c.env.DB.prepare(
      `SELECT 
         COALESCE(SUM(CASE WHEN value = 1 THEN 1 ELSE 0 END), 0) as upvotes,
         COALESCE(SUM(CASE WHEN value = -1 THEN 1 ELSE 0 END), 0) as downvotes,
         COALESCE(SUM(value), 0) as score
       FROM votes 
       WHERE target_type = ? AND target_id = ?`
    )
      .bind(targetType, targetId)
      .first<{ upvotes: number; downvotes: number; score: number }>();
    return c.json(result ?? { upvotes: 0, downvotes: 0, score: 0 });
  });

  // Get current user's vote on a target
  r.get("/my-vote", async (c) => {
    const targetType = c.req.query("targetType");
    const targetId = c.req.query("targetId");
    const uid = ((c as any).user?.id as string) ?? "";
    if (!uid) {
      return c.json({ value: null });
    }
    if (!targetType || !targetId) {
      return c.json({ error: "targetType and targetId required" }, 400);
    }
    const vote = await c.env.DB.prepare(
      "SELECT value FROM votes WHERE user_id = ? AND target_type = ? AND target_id = ?"
    )
      .bind(uid, targetType, targetId)
      .first<{ value: number }>();
    return c.json({ value: vote?.value ?? null });
  });

  return r;
}
