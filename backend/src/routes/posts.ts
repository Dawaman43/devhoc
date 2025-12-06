import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../index";

const postSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
  tags: z.array(z.string()).default([]),
});

export function postsRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  r.get("/", async (c) => {
    // TODO: query posts
    return c.json({ items: [] });
  });

  r.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    // TODO: insert into D1
    return c.json({ id: `p-${Date.now()}`, ...parsed.data });
  });

  r.get("/:postId", async (c) => {
    const { postId } = c.req.param();
    // TODO: get post + stats
    return c.json({ id: postId });
  });

  r.put("/:postId", async (c) => c.json({ ok: true }));
  r.delete("/:postId", async (c) => c.json({ ok: true }));

  return r;
}
