import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authRoutes } from "./routes/auth";
import { postsRoutes } from "./routes/posts";
import { commentsRoutes } from "./routes/comments";
import { votesRoutes } from "./routes/votes";
import { likesRoutes } from "./routes/likes";
import { usersRoutes } from "./routes/users";
import { searchRoutes } from "./routes/search";

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

// JWT auth middleware: if Authorization header present, decode and attach userId
app.use("*", async (c, next) => {
  const auth = c.req.header("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (token) {
    try {
      const secret =
        (c.env as any)?.JWT_SECRET ||
        process.env.JWT_SECRET ||
        "devhoc-dev-secret-change-me";
      const key = new TextEncoder().encode(secret);
      const { jwtVerify } = await import("jose");
      const { payload } = await jwtVerify(token, key, {
        algorithms: ["HS256"],
      });
      (c as any).user = {
        id: payload.sub as string,
        role: (payload as any).role,
      };
    } catch {}
  }
  await next();
});

app.get("/health", (c) => c.json({ ok: true, ts: Date.now() }));

// Prefix API routes with /api to match frontend fetch paths
app.route("/api/auth", authRoutes());
app.route("/api/posts", postsRoutes());
app.route("/api/comments", commentsRoutes());
app.route("/api/votes", votesRoutes());
app.route("/api/likes", likesRoutes());
app.route("/api/users", usersRoutes());
app.route("/api/search", searchRoutes());

export default app;
