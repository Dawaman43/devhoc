import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../index";

const commentSchema = z.object({
  postId: z.string(),
  text: z.string().min(1),
  authorId: z.string().optional(),
});
const replySchema = z.object({
  commentId: z.string(),
  parentReplyId: z.string().optional(),
  text: z.string().min(1),
  authorId: z.string().optional(),
});

export function commentsRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  r.get("/", async (c) => {
    // TODO: list recent comments
    return c.json([
      { id: "c1", postId: "introducing-devhoc", text: "Great write-up!" },
    ]);
  });

  r.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    // TODO: insert comment
    return c.json({ id: `c-${Date.now()}`, ...parsed.data });
  });

  r.post("/reply", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = replySchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    // TODO: insert reply (nested)
    return c.json({ id: `r-${Date.now()}`, ...parsed.data });
  });

  return r;
}
