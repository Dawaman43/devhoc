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
