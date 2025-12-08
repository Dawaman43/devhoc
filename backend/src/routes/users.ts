import { Hono } from "hono";
import type { Env } from "../index";

type UserRow = {
  id: string;
  email: string;
  name: string;
  username?: string | null;
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
  username: (row as any).username ?? undefined,
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

  // Get current authenticated user's profile
  r.get("/me", async (c) => {
    const user = (c as any).user as { id: string } | undefined;
    if (!user?.id) return c.json({ error: "missing auth" }, 401);
    const row = await c.env.DB.prepare(
      "SELECT id, email, name, username, avatar_url, role, reputation, created_at FROM users WHERE id = ?"
    )
      .bind(user.id)
      .first<UserRow>();
    if (!row) return c.json({ error: "user not found" }, 404);
    return c.json(mapUserRow(row));
  });

  // Update current authenticated user's profile
  r.put("/me", async (c) => {
    const auth = (c as any).user as { id: string } | undefined;
    if (!auth?.id) return c.json({ error: "missing auth" }, 401);
    const body = await c.req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const email =
      typeof body.email === "string" ? body.email.trim() : undefined;
    const avatarUrl =
      typeof body.avatarUrl === "string" ? body.avatarUrl.trim() : undefined;
    const username =
      typeof body.username === "string" ? body.username.trim() : undefined;

    if (name !== undefined && name.length < 2)
      return c.json({ error: "invalid name" }, 400);

    // Check email uniqueness
    if (email) {
      const ex = await c.env.DB.prepare(
        "SELECT id FROM users WHERE email = ? AND id != ?"
      )
        .bind(email, auth.id)
        .first();
      if (ex) return c.json({ error: "email already in use" }, 409);
    }

    const sanitize = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 30);

    if (username) {
      const san = sanitize(username);
      const exu = await c.env.DB.prepare(
        "SELECT id FROM users WHERE username = ? AND id != ?"
      )
        .bind(san, auth.id)
        .first();
      if (exu) return c.json({ error: "username already taken" }, 409);
    }

    const cols: string[] = [];
    const binds: any[] = [];
    if (name !== undefined) {
      cols.push("name = ?");
      binds.push(name);
    }
    if (email !== undefined) {
      cols.push("email = ?");
      binds.push(email);
    }
    if (avatarUrl !== undefined) {
      cols.push("avatar_url = ?");
      binds.push(avatarUrl);
    }
    if (username !== undefined) {
      cols.push("username = ?");
      binds.push(sanitize(username));
    }

    if (cols.length === 0) return c.json({ error: "no changes" }, 400);

    binds.push(auth.id);
    const sql = `UPDATE users SET ${cols.join(", ")} WHERE id = ?`;
    await c.env.DB.prepare(sql)
      .bind(...binds)
      .run();

    const updated = await c.env.DB.prepare(
      "SELECT id, email, name, username, avatar_url, role, reputation, created_at FROM users WHERE id = ?"
    )
      .bind(auth.id)
      .first<UserRow>();
    return c.json(mapUserRow(updated as UserRow));
  });

  r.get("/:userId", async (c) => {
    const { userId } = c.req.param();
    const user = await c.env.DB.prepare(
      "SELECT id, email, name, username, avatar_url, role, reputation, created_at FROM users WHERE id = ?"
    )
      .bind(userId)
      .first<UserRow>();
    if (!user) return c.json({ error: "user not found" }, 404);
    return c.json(mapUserRow(user));
  });

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

  // Toggle follow/unfollow for a user (authenticated follower follows :userId)
  r.post("/:userId/follow", async (c) => {
    const user = (c as any).user as { id: string } | undefined;
    if (!user?.id) return c.json({ error: "missing auth" }, 401);
    const { userId } = c.req.param();
    if (userId === user.id)
      return c.json({ error: "can't follow yourself" }, 400);
    try {
      const existing = await c.env.DB.prepare(
        "SELECT id FROM follows WHERE follower_id = ? AND following_id = ?"
      )
        .bind(user.id, userId)
        .first<{ id: string }>();
      if (existing) {
        await c.env.DB.prepare("DELETE FROM follows WHERE id = ?")
          .bind(existing.id)
          .run();
        return c.json({ ok: true, action: "unfollowed" });
      }
      const id = crypto.randomUUID();
      await c.env.DB.prepare(
        "INSERT INTO follows (id, follower_id, following_id) VALUES (?, ?, ?)"
      )
        .bind(id, user.id, userId)
        .run();
      return c.json({ ok: true, action: "followed", id });
    } catch (err) {
      console.error("follow toggle error", err);
      return c.json({ error: String(err) }, 500);
    }
  });

  // Followers count
  r.get("/:userId/followers/count", async (c) => {
    const { userId } = c.req.param();
    const row = await c.env.DB.prepare(
      "SELECT COUNT(1) as cnt FROM follows WHERE following_id = ?"
    )
      .bind(userId)
      .first<{ cnt: number }>();
    return c.json({ count: row?.cnt ?? 0 });
  });

  // Following count
  r.get("/:userId/following/count", async (c) => {
    const { userId } = c.req.param();
    const row = await c.env.DB.prepare(
      "SELECT COUNT(1) as cnt FROM follows WHERE follower_id = ?"
    )
      .bind(userId)
      .first<{ cnt: number }>();
    return c.json({ count: row?.cnt ?? 0 });
  });

  // Check if current user follows :userId
  r.get("/:userId/following/me", async (c) => {
    const user = (c as any).user as { id: string } | undefined;
    if (!user?.id) return c.json({ following: false });
    const { userId } = c.req.param();
    const row = await c.env.DB.prepare(
      "SELECT id FROM follows WHERE follower_id = ? AND following_id = ?"
    )
      .bind(user.id, userId)
      .first<{ id: string }>();
    return c.json({ following: !!row });
  });

  return r;
}
