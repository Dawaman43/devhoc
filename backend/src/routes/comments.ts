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
    const rows = await c.env.DB.prepare(
      "SELECT id, post_id AS postId, author_id AS authorId, text, created_at AS createdAt FROM comments ORDER BY created_at DESC LIMIT 50"
    ).all();
    return c.json(rows.results ?? []);
  });

  r.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const id = crypto.randomUUID();
    const { postId, text } = parsed.data;
    const authorId = ((c as any).user?.id as string) ?? "anonymous";
    await c.env.DB.prepare(
      "INSERT INTO comments (id, post_id, author_id, text) VALUES (?, ?, ?, ?)"
    )
      .bind(id, postId, authorId ?? "anonymous", text)
      .run();
    const row = await c.env.DB.prepare(
      "SELECT id, post_id AS postId, author_id AS author, text, created_at AS createdAt FROM comments WHERE id = ?"
    )
      .bind(id)
      .first();
    return c.json(row ?? { id, postId, author: authorId ?? "anonymous", text });
  });

  r.post("/reply", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = replySchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const id = crypto.randomUUID();
    const { commentId, parentReplyId, text } = parsed.data;
    const authorId = ((c as any).user?.id as string) ?? "anonymous";
    // Determine the post_id by looking up the parent comment/reply
    const parentId = parentReplyId ?? commentId;
    const parent = await c.env.DB.prepare(
      "SELECT post_id AS postId FROM comments WHERE id = ?"
    )
      .bind(parentId)
      .first();
    if (!parent || !parent.postId) {
      return c.json({ error: "parent not found" }, 404);
    }
    await c.env.DB.prepare(
      "INSERT INTO comments (id, post_id, author_id, text, parent_reply_id) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(id, parent.postId, authorId ?? "anonymous", text, parentId)
      .run();
    const row = await c.env.DB.prepare(
      "SELECT id, post_id AS postId, author_id AS author, text, parent_reply_id AS parentReplyId, created_at AS createdAt FROM comments WHERE id = ?"
    )
      .bind(id)
      .first();
    return c.json(
      row ?? {
        id,
        postId: parent.postId,
        author: authorId ?? "anonymous",
        text,
        parentReplyId: parentId,
      }
    );
  });

  return r;
}
