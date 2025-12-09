import { Hono } from "hono";
import { jwtVerify } from "jose";
import type { Env } from "../index";

function getJwtKey(secret?: string) {
  const s = secret ?? process.env.JWT_SECRET ?? "devhoc-dev-secret-change-me";
  return new TextEncoder().encode(s);
}

export function adminRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  // Simple admin auth middleware using JWT role
  r.use("*", async (c, next) => {
    const auth = c.req.headers.get("Authorization") || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token) return c.json({ error: "missing token" }, 401);
    try {
      const key = getJwtKey((c.env as any)?.JWT_SECRET);
      const { payload } = await jwtVerify(token, key, {
        algorithms: ["HS256"],
      });
      if ((payload as any).role !== "ADMIN") {
        return c.json({ error: "forbidden" }, 403);
      }
      (c as any).adminPayload = payload;
      await next();
    } catch (err) {
      return c.json({ error: "invalid token" }, 401);
    }
  });

  // Verify/unverify a user
  r.post("/users/:id/verify", async (c) => {
    const id = c.req.param("id");
    try {
      // Toggle: if verified=1 then set 0, else 1
      const row = await c.env.DB.prepare(
        "SELECT verified FROM users WHERE id = ?"
      )
        .bind(id)
        .first<{ verified: number }>();
      if (!row) return c.json({ error: "user not found" }, 404);
      const nextVal = Number((row as any).verified ?? 0) === 1 ? 0 : 1;
      await c.env.DB.prepare("UPDATE users SET verified = ? WHERE id = ?")
        .bind(nextVal, id)
        .run();
      return c.json({ ok: true, verified: nextVal === 1 });
    } catch (err) {
      console.error("admin verify error", err);
      return c.json({ error: String(err) }, 500);
    }
  });

  return r;
}
