import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../index";

const commentSchema = z.object({
  postId: z.string(),
  text: z.string().min(1),
});
const replySchema = z.object({
  commentId: z.string(),
  parentReplyId: z.string().optional(),
  text: z.string().min(1),
});

type CommentRow = {
  id: string;
  postId: string;
  authorId: string;
  authorName?: string | null;
  text: string;
  parentReplyId?: string | null;
  createdAt: string;
};

const mapCommentRow = (row: CommentRow) => ({
  ...row,
  authorName: row.authorName ?? row.authorId,
});

export function commentsRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  r.get("/", async (c) => {
    const postId = c.req.query("postId");
    const baseSql = `SELECT c.id,
                            c.post_id AS postId,
                            c.author_id AS authorId,
                            COALESCE(u.name, c.author_id) AS authorName,
                            c.text,
                            c.parent_reply_id AS parentReplyId,
                            c.created_at AS createdAt
                       FROM comments c
                       LEFT JOIN users u ON u.id = c.author_id`;
    const sql = postId
      ? `${baseSql} WHERE c.post_id = ? ORDER BY c.created_at DESC`
      : `${baseSql} ORDER BY c.created_at DESC LIMIT 100`;
    const stmt = c.env.DB.prepare(sql);
    const rows = postId
      ? await stmt.bind(postId).all<CommentRow>()
      : await stmt.all<CommentRow>();
    const items = (rows.results ?? []).map((row) => mapCommentRow(row));
    return c.json(items);
  });

  r.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const id = crypto.randomUUID();
    const { postId, text } = parsed.data;
    const authorId = ((c as any).user?.id as string) ?? "";
    if (!authorId) {
      return c.json({ error: "authentication required" }, 401);
    }
    await c.env.DB.prepare(
      "INSERT INTO comments (id, post_id, author_id, text) VALUES (?, ?, ?, ?)"
    )
      .bind(id, postId, authorId, text)
      .run();
    const row = await c.env.DB.prepare(
      `SELECT c.id,
              c.post_id AS postId,
              c.author_id AS authorId,
              COALESCE(u.name, c.author_id) AS authorName,
              c.text,
              c.parent_reply_id AS parentReplyId,
              c.created_at AS createdAt
         FROM comments c
         LEFT JOIN users u ON u.id = c.author_id
         WHERE c.id = ?`
    )
      .bind(id)
      .first<CommentRow>();
    return c.json(row ? mapCommentRow(row) : { id, postId, authorId, text });
  });

  r.post("/reply", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = replySchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const id = crypto.randomUUID();
    const { commentId, parentReplyId, text } = parsed.data;
    const authorId = ((c as any).user?.id as string) ?? "";
    if (!authorId) {
      return c.json({ error: "authentication required" }, 401);
    }
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
      .bind(id, parent.postId, authorId, text, parentId)
      .run();
    const row = await c.env.DB.prepare(
      `SELECT c.id,
              c.post_id AS postId,
              c.author_id AS authorId,
              COALESCE(u.name, c.author_id) AS authorName,
              c.text,
              c.parent_reply_id AS parentReplyId,
              c.created_at AS createdAt
         FROM comments c
         LEFT JOIN users u ON u.id = c.author_id
         WHERE c.id = ?`
    )
      .bind(id)
      .first<CommentRow>();
    return c.json(
      row
        ? mapCommentRow(row)
        : {
            id,
            postId: parent.postId,
            authorId,
            text,
            parentReplyId: parentId,
          }
    );
  });

  return r;
}
