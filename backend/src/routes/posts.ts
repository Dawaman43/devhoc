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
    const rows = await c.env.DB.prepare(
      "SELECT p.id, p.title, p.content, p.author_id AS authorId, p.views, p.created_at AS createdAt FROM posts p ORDER BY p.created_at DESC LIMIT 50"
    ).all();
    return c.json({ items: rows.results ?? [] });
  });

  r.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const id = crypto.randomUUID();
    const authorId = ((c as any).user?.id as string) ?? "anonymous";
    const { title, content, tags } = parsed.data;
    await c.env.DB.prepare(
      "INSERT INTO posts (id, author_id, title, content) VALUES (?, ?, ?, ?)"
    )
      .bind(id, authorId, title, content)
      .run();
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
      "SELECT id, title, content, author_id AS authorId, views, created_at AS createdAt FROM posts WHERE id = ?"
    )
      .bind(id)
      .first();
    return c.json(row ?? { id, title, content, authorId, views: 0 });
  });

  r.get("/:postId", async (c) => {
    const { postId } = c.req.param();
    const post = await c.env.DB.prepare(
      "SELECT id, title, content, author_id AS authorId, views, created_at AS createdAt FROM posts WHERE id = ?"
    )
      .bind(postId)
      .first();
    if (!post) return c.json({ error: "not found" }, 404);
    // Increment views
    await c.env.DB.prepare("UPDATE posts SET views = views + 1 WHERE id = ?")
      .bind(postId)
      .run();
    return c.json(post);
  });

  r.put("/:postId", async (c) => {
    const { postId } = c.req.param();
    const body = await c.req.json().catch(() => ({}));
    const parsed = postSchema.partial().safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    // Optionally, enforce ownership by authorId
    const actorId = ((c as any).user?.id as string) ?? "";
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
      "SELECT id, title, content, author_id AS authorId, views, created_at AS createdAt FROM posts WHERE id = ?"
    )
      .bind(postId)
      .first();
    return c.json(post ?? { id: postId });
  });

  r.delete("/:postId", async (c) => {
    const { postId } = c.req.param();
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
