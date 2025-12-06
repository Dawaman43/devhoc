import { Hono } from "hono";
import { z } from "zod";
import { SignJWT, jwtVerify } from "jose";
import type { Env } from "../index";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function getJwtKey(secret?: string) {
  const s = secret ?? process.env.JWT_SECRET ?? "devhoc-dev-secret-change-me";
  return new TextEncoder().encode(s);
}

export function authRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  r.post("/register", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    // TODO: hash + insert user into D1 and return created user
    return c.json({ ok: true });
  });

  r.post("/login", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    // TODO: verify credentials against D1 and fetch real user id + role
    const demoUserId = "demo-user-id";
    const demoRole = "USER";

    const alg = "HS256";
    const key = getJwtKey((c.env as any)?.JWT_SECRET);

    const jwt = await new SignJWT({ role: demoRole })
      .setProtectedHeader({ alg })
      .setSubject(demoUserId)
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(key);

    return c.json({ token: jwt });
  });

  r.post("/logout", (c) => c.json({ ok: true }));

  // Optional: token introspection helper
  r.get("/me", async (c) => {
    const auth = c.req.headers.get("Authorization") || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token) return c.json({ error: "missing token" }, 401);
    try {
      const key = getJwtKey((c.env as any)?.JWT_SECRET);
      const { payload } = await jwtVerify(token, key, {
        algorithms: ["HS256"],
      });
      return c.json({ ok: true, payload });
    } catch (err) {
      return c.json({ error: "invalid token" }, 401);
    }
  });

  return r;
}
