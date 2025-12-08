import { Hono } from "hono";
import type { Env } from "../index";

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

export function searchRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  // Search posts
  r.get("/posts", async (c) => {
    const query = c.req.query("q") || "";
    const tag = c.req.query("tag");
    const sort = c.req.query("sort") || "newest"; // newest, oldest, views, title
    const limit = parseInt(c.req.query("limit") || "50");

    let sql = `SELECT p.id,
                      p.title,
                      p.content,
                      p.author_id AS authorId,
                      COALESCE(u.name, p.author_id) AS authorName,
                      p.views,
                      p.created_at AS createdAt,
                      GROUP_CONCAT(pt.tag_id) AS tags
                 FROM posts p
                 LEFT JOIN users u ON u.id = p.author_id
                 LEFT JOIN post_tags pt ON pt.post_id = p.id`;

    const conditions: string[] = [];
    const bindings: string[] = [];

    if (query) {
      conditions.push("(p.title LIKE ? OR p.content LIKE ?)");
      const likeQuery = `%${query}%`;
      bindings.push(likeQuery, likeQuery);
    }

    if (tag) {
      sql += ` JOIN post_tags pt2 ON pt2.post_id = p.id`;
      conditions.push("pt2.tag_id = ?");
      bindings.push(tag);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += ` GROUP BY p.id`;

    // Add sorting
    switch (sort) {
      case "oldest":
        sql += " ORDER BY p.created_at ASC";
        break;
      case "views":
        sql += " ORDER BY p.views DESC";
        break;
      case "title":
        sql += " ORDER BY p.title ASC";
        break;
      case "newest":
      default:
        sql += " ORDER BY p.created_at DESC";
    }

    sql += ` LIMIT ?`;
    bindings.push(String(limit));

    let stmt = c.env.DB.prepare(sql);
    for (const binding of bindings) {
      stmt = stmt.bind(binding);
    }

    const rows = await stmt.all<PostRow>();
    const items = (rows.results ?? []).map((row) => mapPostRow(row));
    return c.json({ items, query, tag, sort });
  });

  // Get all tags
  r.get("/tags", async (c) => {
    const rows = await c.env.DB.prepare(
      `SELECT t.id, t.name, COUNT(pt.post_id) as count
       FROM tags t
       LEFT JOIN post_tags pt ON pt.tag_id = t.id
       GROUP BY t.id
       ORDER BY count DESC
       LIMIT 100`
    ).all<{ id: string; name: string; count: number }>();
    return c.json({ items: rows.results ?? [] });
  });

  // Search comments
  r.get("/comments", async (c) => {
    const query = c.req.query("q") || "";
    const limit = parseInt(c.req.query("limit") || "50");
    let sql = `SELECT c.id, c.post_id AS postId, c.author_id AS authorId, COALESCE(u.name, c.author_id) AS authorName, c.text, c.parent_reply_id AS parentReplyId, c.created_at AS createdAt FROM comments c LEFT JOIN users u ON u.id = c.author_id`;
    const bindings: string[] = [];
    if (query) {
      sql += ` WHERE c.text LIKE ?`;
      bindings.push(`%${query}%`);
    }
    sql += ` ORDER BY c.created_at DESC LIMIT ?`;
    bindings.push(String(limit));
    let stmt = c.env.DB.prepare(sql);
    for (const b of bindings) stmt = stmt.bind(b);
    const rows = await stmt.all();
    return c.json({ items: rows.results ?? [], query });
  });

  // Search users
  r.get("/users", async (c) => {
    try {
      const query = c.req.query("q") || "";
      const limit = parseInt(c.req.query("limit") || "50");
      let sql = `SELECT id, name, username, avatar_url AS avatarUrl, role, reputation, created_at AS createdAt FROM users`;
      const bindings: string[] = [];
      if (query) {
        sql += ` WHERE name LIKE ? OR email LIKE ? OR username LIKE ?`;
        const like = `%${query}%`;
        bindings.push(like, like, like);
      }
      sql += ` ORDER BY name ASC LIMIT ?`;
      bindings.push(String(limit));
      let stmt = c.env.DB.prepare(sql);
      for (const b of bindings) stmt = stmt.bind(b);
      const rows = await stmt.all();
      return c.json({ items: rows.results ?? [], query });
    } catch (err: any) {
      console.error("search /users error", err?.message ?? err);
      return c.json({ error: String(err?.message ?? err) }, 500);
    }
  });

  // Inline suggestions (posts titles and user names)
  r.get("/suggest", async (c) => {
    const q = (c.req.query("q") || "").trim();
    if (!q) return c.json({ posts: [], users: [] });
    const likeQ = `%${q}%`;
    const postsRows = await c.env.DB.prepare(
      `SELECT id, title FROM posts WHERE title LIKE ? ORDER BY created_at DESC LIMIT 6`
    )
      .bind(likeQ)
      .all<{ id: string; title: string }>();
    const usersRows = await c.env.DB.prepare(
      `SELECT id, name, username FROM users WHERE name LIKE ? OR username LIKE ? ORDER BY name ASC LIMIT 6`
    )
      .bind(likeQ)
      .all<{ id: string; name: string }>();
    return c.json({
      posts: postsRows.results ?? [],
      users: usersRows.results ?? [],
    });
  });

  // Trending posts (by views in last 7 days)
  r.get("/trending", async (c) => {
    const limit = parseInt(c.req.query("limit") || "10");
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
         WHERE p.created_at > datetime('now', '-7 days')
         GROUP BY p.id
         ORDER BY p.views DESC
         LIMIT ?`
    )
      .bind(limit)
      .all<PostRow>();
    const items = (rows.results ?? []).map((row) => mapPostRow(row));
    return c.json({ items });
  });

  return r;
}
