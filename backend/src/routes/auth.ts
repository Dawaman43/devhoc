import { Hono } from "hono";
import { z } from "zod";
import { SignJWT, jwtVerify } from "jose";
import type { Env } from "../index";

function toBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  // Use global btoa if available (Cloudflare Workers provide this)
  if (typeof btoa === "function") return btoa(binary);
  // Fallback: try Buffer if present
  // @ts-ignore
  if (typeof Buffer !== "undefined")
    return Buffer.from(bytes).toString("base64");
  throw new Error("No base64 encoder available");
}

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
    try {
      const body = await c.req.json().catch(() => ({}));
      const parsed = registerSchema.safeParse(body);
      if (!parsed.success)
        return c.json({ error: parsed.error.flatten() }, 400);
      const { email, password, name } = parsed.data;
      const existing = await c.env.DB.prepare(
        "SELECT id FROM users WHERE email = ?"
      )
        .bind(email)
        .first();
      if (existing) return c.json({ error: "email already registered" }, 409);
      const salt = crypto.randomUUID();
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
      );
      const bits = await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          hash: "SHA-256",
          salt: enc.encode(salt),
          iterations: 100_000,
        },
        keyMaterial,
        256
      );
      const hash = toBase64(bits);
      const password_hash = `${salt}:${hash}`;
      const id = crypto.randomUUID();
      await c.env.DB.prepare(
        "INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)"
      )
        .bind(id, email, password_hash, name)
        .run();
      return c.json({ id, email, name });
    } catch (err: any) {
      console.error("register handler error:", err);
      return c.json({ error: String(err?.message ?? err) }, 500);
    }
  });

  r.post("/login", async (c) => {
    try {
      const body = await c.req.json().catch(() => ({}));
      const parsed = loginSchema.safeParse(body);
      if (!parsed.success)
        return c.json({ error: parsed.error.flatten() }, 400);
      const { email, password } = parsed.data;
      const user = await c.env.DB.prepare(
        "SELECT id, password_hash, role, name FROM users WHERE email = ?"
      )
        .bind(email)
        .first();
      if (!user) return c.json({ error: "invalid credentials" }, 401);
      const [salt, stored] = String(user.password_hash).split(":");
      const enc = new TextEncoder();
      const km = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
      );
      const bits = await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          hash: "SHA-256",
          salt: enc.encode(salt),
          iterations: 100_000,
        },
        km,
        256
      );
      const calc = toBase64(bits);
      if (calc !== stored) return c.json({ error: "invalid credentials" }, 401);

      const alg = "HS256";
      const key = getJwtKey((c.env as any)?.JWT_SECRET);

      const jwt = await new SignJWT({ role: (user as any).role ?? "USER" })
        .setProtectedHeader({ alg })
        .setSubject((user as any).id)
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(key);

      return c.json({
        token: jwt,
        user: {
          id: (user as any).id,
          email,
          name: (user as any).name,
          role: (user as any).role ?? "USER",
        },
      });
    } catch (err: any) {
      console.error("login handler error:", err);
      return c.json({ error: String(err?.message ?? err) }, 500);
    }
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
