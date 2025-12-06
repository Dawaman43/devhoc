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
    // TODO: enforce one vote per user per target in D1
    return c.json({ ok: true });
  });

  return r;
}
