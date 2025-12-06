import { Hono } from "hono";
import type { Env } from "../index";

type UserRow = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  role: string;
  reputation: number;
  created_at: string;
};

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

const mapUserRow = (row: UserRow) => ({
  id: row.id,
  email: row.email,
  name: row.name,
  avatarUrl: row.avatar_url,
  role: row.role,
  reputation: row.reputation,
  createdAt: row.created_at,
});

const mapPostRow = (row: PostRow) => ({
  ...row,
  authorName: row.authorName ?? row.authorId,
  tags: row.tags ? String(row.tags).split(",").filter(Boolean) : [],
});

export function usersRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  // Update current user's profile
  r.put("/me", async (c) => {
    const user = (c as any).user as { id: string } | undefined;
    if (!user?.id) return c.json({ error: "missing auth" }, 401);
    const body = await c.req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const email =
      typeof body.email === "string" ? body.email.trim() : undefined;
    const avatarUrl =
      typeof body.avatarUrl === "string" ? body.avatarUrl.trim() : undefined;

    if (name !== undefined && name.length < 2) {
      return c.json(
        {
          error: {
            fieldErrors: {
              name: ["Too small: expected string to have >=2 characters"],
            },
          },
        },
        400
      );
    }

    // If email provided, ensure it's not used by someone else
    if (email) {
      const existing = await c.env.DB.prepare(
        "SELECT id FROM users WHERE email = ?"
      )
        .bind(email)
        .first();
      if (existing && (existing as any).id !== user.id) {
        return c.json({ error: "email already registered" }, 409);
      }
    }

    // Build update statement dynamically
    const updates: string[] = [];
    const params: any[] = [];
    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }
    if (email !== undefined) {
      updates.push("email = ?");
      params.push(email);
    }
    if (avatarUrl !== undefined) {
      updates.push("avatar_url = ?");
      params.push(avatarUrl);
    }

    if (updates.length === 0) {
      // nothing to do — return current user
      const row = await c.env.DB.prepare(
        "SELECT id, email, name, avatar_url, role, reputation, created_at FROM users WHERE id = ?"
      )
        .bind(user.id)
        .first<UserRow>();
      if (!row) return c.json({ error: "user not found" }, 404);
      return c.json(mapUserRow(row));
    }

    params.push(user.id);
    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    await c.env.DB.prepare(sql)
      .bind(...params)
      .run();

    const row = await c.env.DB.prepare(
      "SELECT id, email, name, avatar_url, role, reputation, created_at FROM users WHERE id = ?"
    )
      .bind(user.id)
      .first<UserRow>();
    if (!row) return c.json({ error: "user not found" }, 404);
    return c.json(mapUserRow(row));
  });

  // Get user profile
  r.get("/:userId", async (c) => {
    const { userId } = c.req.param();
    const user = await c.env.DB.prepare(
      "SELECT id, email, name, avatar_url, role, reputation, created_at FROM users WHERE id = ?"
    )
      .bind(userId)
      .first<UserRow>();
    if (!user) return c.json({ error: "user not found" }, 404);
    return c.json(mapUserRow(user));
  });

  // Get user's posts
  r.get("/:userId/posts", async (c) => {
    const { userId } = c.req.param();
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
         WHERE p.author_id = ?
         GROUP BY p.id
         ORDER BY p.created_at DESC
         LIMIT 50`
    )
      .bind(userId)
      .all<PostRow>();
    const items = (rows.results ?? []).map((row) => mapPostRow(row));
    return c.json({ items });
  });

  // Get user's comments
  r.get("/:userId/comments", async (c) => {
    const { userId } = c.req.param();
    const rows = await c.env.DB.prepare(
      `SELECT c.id,
              c.post_id AS postId,
              c.author_id AS authorId,
              COALESCE(u.name, c.author_id) AS authorName,
              c.text,
              c.parent_reply_id AS parentReplyId,
              c.created_at AS createdAt
         FROM comments c
         LEFT JOIN users u ON u.id = c.author_id
         WHERE c.author_id = ?
         ORDER BY c.created_at DESC
         LIMIT 50`
    )
      .bind(userId)
      .all();
    return c.json(rows.results ?? []);
  });

  // Get user's activity stats
  r.get("/:userId/stats", async (c) => {
    const { userId } = c.req.param();
    const postCount = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM posts WHERE author_id = ?"
    )
      .bind(userId)
      .first<{ count: number }>();
    const commentCount = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM comments WHERE author_id = ?"
    )
      .bind(userId)
      .first<{ count: number }>();
    const totalVotes = await c.env.DB.prepare(
      `SELECT COALESCE(SUM(v.value), 0) as score
       FROM votes v
       JOIN posts p ON p.id = v.target_id AND v.target_type = 'post'
       WHERE p.author_id = ?
       UNION ALL
       SELECT COALESCE(SUM(v.value), 0) as score
       FROM votes v
       JOIN comments c ON c.id = v.target_id AND v.target_type = 'comment'
       WHERE c.author_id = ?`
    )
      .bind(userId, userId)
      .all<{ score: number }>();
    const totalScore =
      (totalVotes.results ?? []).reduce((acc, row) => acc + row.score, 0) ?? 0;
    return c.json({
      postCount: postCount?.count ?? 0,
      commentCount: commentCount?.count ?? 0,
      totalScore,
    });
  });

  return r;
}
