import { Hono } from "hono";
import { z } from "zod";
import jwt from "jsonwebtoken";
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

export function authRoutes() {
  const r = new Hono<{ Bindings: Env }>();

  r.post("/register", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    // TODO: hash + insert user in D1
    return c.json({ ok: true });
  });

  r.post("/login", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    // TODO: check creds
    const token = jwt.sign(
      { sub: "demo-user-id", role: "USER" },
      c.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return c.json({ token });
  });

  r.post("/logout", (c) => c.json({ ok: true }));

  return r;
}
