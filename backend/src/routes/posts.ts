import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../index";

const postSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
  tags: z.array(z.string()).default([]),
});

type PostRow = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string | null;
  views: number;
  createdAt: string;
  tags?: string | null;
};

const mapPostRow = (row: PostRow) => ({
  ...row,
  authorName: row.authorName ?? row.authorId,
  tags: row.tags ? String(row.tags).split(",").filter(Boolean) : [],
});

export function postsRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  r.get("/", async (c) => {
    const rows = await c.env.DB.prepare(
      `SELECT p.id,
              p.title,
              p.content,
              p.author_id AS authorId,
              COALESCE(u.name, p.author_id) AS authorName,
              p.views,
              p.created_at AS createdAt,
              GROUP_CONCAT(pt.tag_id) AS tags
         FROM posts p
         LEFT JOIN users u ON u.id = p.author_id
         LEFT JOIN post_tags pt ON pt.post_id = p.id
         GROUP BY p.id
         ORDER BY p.created_at DESC
         LIMIT 50`
    ).all<PostRow>();
    const items = (rows.results ?? []).map((row) => mapPostRow(row));
    return c.json({ items });
  });

  r.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const actorId = ((c as any).user?.id as string) ?? "";
    if (!actorId) {
      return c.json({ error: "authentication required" }, 401);
    }
    const id = crypto.randomUUID();
    const { title, content, tags } = parsed.data;
    await c.env.DB.prepare(
      "INSERT INTO posts (id, author_id, title, content) VALUES (?, ?, ?, ?)"
    ).bind(id, actorId, title, content).run();
    // Insert tags
    for (const t of tags) {
      await c.env.DB.prepare(
        "INSERT OR IGNORE INTO tags (id, name) VALUES (?, ?)"
      )
        .bind(t, t)
        .run();
      await c.env.DB.prepare(
        "INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)"
      )
        .bind(id, t)
        .run();
    }
    const row = await c.env.DB.prepare(
      `SELECT p.id,
              p.title,
              p.content,
              p.author_id AS authorId,
              COALESCE(u.name, p.author_id) AS authorName,
              p.views,
              p.created_at AS createdAt,
              GROUP_CONCAT(pt.tag_id) AS tags
         FROM posts p
         LEFT JOIN users u ON u.id = p.author_id
         LEFT JOIN post_tags pt ON pt.post_id = p.id
         WHERE p.id = ?
         GROUP BY p.id`
    )
      .bind(id)
      .first<PostRow>();
    return c.json(row ? mapPostRow(row) : { id, title, content, authorId: actorId, tags, views: 0 });
  });

  r.get("/:postId", async (c) => {
    const { postId } = c.req.param();
    const post = await c.env.DB.prepare(
      `SELECT p.id,
              p.title,
              p.content,
              p.author_id AS authorId,
              COALESCE(u.name, p.author_id) AS authorName,
              p.views,
              p.created_at AS createdAt,
              GROUP_CONCAT(pt.tag_id) AS tags
         FROM posts p
         LEFT JOIN users u ON u.id = p.author_id
         LEFT JOIN post_tags pt ON pt.post_id = p.id
         WHERE p.id = ?
         GROUP BY p.id`
    )
      .bind(postId)
      .first<PostRow>();
    if (!post) return c.json({ error: "not found" }, 404);
    // Increment views
    await c.env.DB.prepare("UPDATE posts SET views = views + 1 WHERE id = ?")
      .bind(postId)
      .run();
    return c.json(mapPostRow(post));
  });

  r.put("/:postId", async (c) => {
    const { postId } = c.req.param();
    const body = await c.req.json().catch(() => ({}));
    const parsed = postSchema.partial().safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const actorId = ((c as any).user?.id as string) ?? "";
    if (!actorId) {
      return c.json({ error: "authentication required" }, 401);
    }
    const { title, content } = parsed.data;
    if (title)
      await c.env.DB.prepare("UPDATE posts SET title = ? WHERE id = ?")
        .bind(title, postId)
        .run();
    if (content)
      await c.env.DB.prepare("UPDATE posts SET content = ? WHERE id = ?")
        .bind(content, postId)
        .run();
    const post = await c.env.DB.prepare(
      `SELECT p.id,
              p.title,
              p.content,
              p.author_id AS authorId,
              COALESCE(u.name, p.author_id) AS authorName,
              p.views,
              p.created_at AS createdAt,
              GROUP_CONCAT(pt.tag_id) AS tags
         FROM posts p
         LEFT JOIN users u ON u.id = p.author_id
         LEFT JOIN post_tags pt ON pt.post_id = p.id
         WHERE p.id = ?
         GROUP BY p.id`
    )
      .bind(postId)
      .first<PostRow>();
    return c.json(post ? mapPostRow(post) : { id: postId });
  });

  r.delete("/:postId", async (c) => {
    const { postId } = c.req.param();
    const actorId = ((c as any).user?.id as string) ?? "";
    if (!actorId) {
      return c.json({ error: "authentication required" }, 401);
    }
    await c.env.DB.prepare("DELETE FROM post_tags WHERE post_id = ?")
      .bind(postId)
      .run();
    await c.env.DB.prepare("DELETE FROM comments WHERE post_id = ?")
      .bind(postId)
      .run();
    await c.env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(postId).run();
    return c.json({ ok: true });
  });

  return r;
}
