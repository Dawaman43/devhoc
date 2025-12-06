import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authRoutes } from "./routes/auth";
import { postsRoutes } from "./routes/posts";
import { commentsRoutes } from "./routes/comments";
import { votesRoutes } from "./routes/votes";

export type Env = {
  DB: D1Database;
  BUCKET: R2Bucket;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger());
app.use(
  "*",
  cors({ origin: "*", allowHeaders: ["Content-Type", "Authorization"] })
);

app.get("/health", (c) => c.json({ ok: true, ts: Date.now() }));

app.route("/auth", authRoutes());
app.route("/posts", postsRoutes());
app.route("/comments", commentsRoutes());
app.route("/votes", votesRoutes());

export default app;
