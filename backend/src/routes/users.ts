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
    return c.json({ items });

    // Toggle follow/unfollow for a user (authenticated follower follows :userId)
    r.post('/:userId/follow', async (c) => {
      const user = (c as any).user as { id: string } | undefined;
      if (!user?.id) return c.json({ error: 'missing auth' }, 401);
      const { userId } = c.req.param();
      if (userId === user.id) return c.json({ error: "can't follow yourself" }, 400);
      try {
        const existing = await c.env.DB.prepare(
          'SELECT id FROM follows WHERE follower_id = ? AND following_id = ?'
        )
          .bind(user.id, userId)
          .first<{ id: string }>();
        if (existing) {
          await c.env.DB.prepare('DELETE FROM follows WHERE id = ?').bind(existing.id).run();
          return c.json({ ok: true, action: 'unfollowed' });
        }
        const id = crypto.randomUUID();
        await c.env.DB.prepare(
          'INSERT INTO follows (id, follower_id, following_id) VALUES (?, ?, ?)'
        )
          .bind(id, user.id, userId)
          .run();
        return c.json({ ok: true, action: 'followed', id });
      } catch (err) {
        console.error('follow toggle error', err);
        return c.json({ error: String(err) }, 500);
      }
    });

    // Followers count
    r.get('/:userId/followers/count', async (c) => {
      const { userId } = c.req.param();
      const row = await c.env.DB.prepare('SELECT COUNT(1) as cnt FROM follows WHERE following_id = ?')
        .bind(userId)
        .first<{ cnt: number }>();
      return c.json({ count: row?.cnt ?? 0 });
    });

    // Following count
    r.get('/:userId/following/count', async (c) => {
      const { userId } = c.req.param();
      const row = await c.env.DB.prepare('SELECT COUNT(1) as cnt FROM follows WHERE follower_id = ?')
        .bind(userId)
        .first<{ cnt: number }>();
      return c.json({ count: row?.cnt ?? 0 });
    });

    // Check if current user follows :userId
    r.get('/:userId/following/me', async (c) => {
      const user = (c as any).user as { id: string } | undefined;
      if (!user?.id) return c.json({ following: false });
      const { userId } = c.req.param();
      const row = await c.env.DB.prepare('SELECT id FROM follows WHERE follower_id = ? AND following_id = ?')
        .bind(user.id, userId)
        .first<{ id: string }>();
      return c.json({ following: !!row });
    });
  });

  // Get user's comments
  r.get("/:userId/comments", async (c) => {
    const { userId } = c.req.param();
    const rows = await c.env.DB.prepare(
      `SELECT c.id,
              c.post_id AS postId,
              c.author_id AS authorId,
              COALESCE(u.name, c.author_id) AS authorName,

    // Toggle follow/unfollow for a user (authenticated follower follows :userId)
    r.post('/:userId/follow', async (c) => {
      const user = (c as any).user as { id: string } | undefined;
      if (!user?.id) return c.json({ error: 'missing auth' }, 401);
      const { userId } = c.req.param();
      if (userId === user.id) return c.json({ error: "can't follow yourself" }, 400);
      try {
        const existing = await c.env.DB.prepare(
          'SELECT id FROM follows WHERE follower_id = ? AND following_id = ?'
        )
          .bind(user.id, userId)
          .first<{ id: string }>();
        if (existing) {
          await c.env.DB.prepare('DELETE FROM follows WHERE id = ?').bind(existing.id).run();
          return c.json({ ok: true, action: 'unfollowed' });
        }
        const id = crypto.randomUUID();
        await c.env.DB.prepare(
          'INSERT INTO follows (id, follower_id, following_id) VALUES (?, ?, ?)'
        )
          .bind(id, user.id, userId)
          .run();
        return c.json({ ok: true, action: 'followed', id });
      } catch (err) {
        console.error('follow toggle error', err);
        return c.json({ error: String(err) }, 500);
      }
    });

    // Followers count
    r.get('/:userId/followers/count', async (c) => {
      const { userId } = c.req.param();
      const row = await c.env.DB.prepare('SELECT COUNT(1) as cnt FROM follows WHERE following_id = ?')
        .bind(userId)
        .first<{ cnt: number }>();
      return c.json({ count: row?.cnt ?? 0 });
    });

    // Following count
    r.get('/:userId/following/count', async (c) => {
      const { userId } = c.req.param();
      const row = await c.env.DB.prepare('SELECT COUNT(1) as cnt FROM follows WHERE follower_id = ?')
        .bind(userId)
        .first<{ cnt: number }>();
      return c.json({ count: row?.cnt ?? 0 });
    });

    // Check if current user follows :userId
    r.get('/:userId/following/me', async (c) => {
      const user = (c as any).user as { id: string } | undefined;
      if (!user?.id) return c.json({ following: false });
      const { userId } = c.req.param();
      const row = await c.env.DB.prepare('SELECT id FROM follows WHERE follower_id = ? AND following_id = ?')
        .bind(user.id, userId)
        .first<{ id: string }>();
      return c.json({ following: !!row });
    });
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
