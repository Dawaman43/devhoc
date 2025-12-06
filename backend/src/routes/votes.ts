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
    const uid = ((c as any).user?.id as string) ?? "anonymous";
    const id = crypto.randomUUID();
    const value = delta === "up" ? 1 : -1;
    // Try insert; unique(user_id, target_type, target_id) enforces one vote per user per target
    const res = await c.env.DB.prepare(
      "INSERT INTO votes (id, user_id, target_type, target_id, value) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(id, uid, targetType, targetId, value)
      .run();
    if ((res as any).error) {
      return c.json({ error: "already voted" }, 409);
    }
    return c.json({ ok: true, id, value });
  });

  return r;
}
