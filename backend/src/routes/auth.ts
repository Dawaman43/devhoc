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
  username: z.string().min(2).optional(),
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
      const { email, password, name, username: rawUsername } = parsed.data;
      const existing = await c.env.DB.prepare(
        "SELECT id FROM users WHERE email = ?"
      )
        .bind(email)
        .first();
      if (existing) return c.json({ error: "email already registered" }, 409);
      // sanitize and optionally validate username uniqueness
      const sanitize = (s: string) =>
        s
          .toLowerCase()
          .replace(/[^a-z0-9._-]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 30);
      let username: string | undefined = undefined;
      if (typeof rawUsername === "string" && rawUsername.trim()) {
        username = sanitize(rawUsername.trim());
        const existsU = await c.env.DB.prepare(
          "SELECT id FROM users WHERE username = ?"
        )
          .bind(username)
          .first();
        if (existsU) return c.json({ error: "username already taken" }, 409);
      }
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
      if (username) {
        await c.env.DB.prepare(
          "INSERT INTO users (id, email, password_hash, name, username) VALUES (?, ?, ?, ?, ?)"
        )
          .bind(id, email, password_hash, name, username)
          .run();
      } else {
        await c.env.DB.prepare(
          "INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)"
        )
          .bind(id, email, password_hash, name)
          .run();
      }
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
          username: (user as any).username ?? undefined,
          role: (user as any).role ?? "USER",
          verified: Number((user as any).verified ?? 0) === 1,
        },
      });
    } catch (err: any) {
      console.error("login handler error:", err);
      return c.json({ error: String(err?.message ?? err) }, 500);
    }
  });

  r.post("/logout", (c) => c.json({ ok: true }));

  r.post("/change-password", async (c) => {
    const auth = c.req.headers.get("Authorization") || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token) return c.json({ error: "missing token" }, 401);
    try {
      const key = getJwtKey((c.env as any)?.JWT_SECRET);
      const { payload } = await jwtVerify(token, key, {
        algorithms: ["HS256"],
      });
      const userId = payload.sub as string | undefined;
      if (!userId) return c.json({ error: "invalid token" }, 401);

      const body = await c.req.json().catch(() => ({}));
      const oldPassword =
        typeof body.oldPassword === "string" ? body.oldPassword : "";
      const newPassword =
        typeof body.newPassword === "string" ? body.newPassword : "";
      if (!oldPassword || !newPassword || newPassword.length < 8) {
        return c.json({ error: "invalid payload" }, 400);
      }

      const row = await c.env.DB.prepare(
        "SELECT password_hash FROM users WHERE id = ?"
      )
        .bind(userId)
        .first();
      if (!row) return c.json({ error: "user not found" }, 404);
      const [salt, stored] = String((row as any).password_hash ?? "").split(
        ":"
      );
      const enc = new TextEncoder();
      const km = await crypto.subtle.importKey(
        "raw",
        enc.encode(oldPassword),
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

      // compute new hash
      const newSalt = crypto.randomUUID();
      const newKm = await crypto.subtle.importKey(
        "raw",
        enc.encode(newPassword),
        "PBKDF2",
        false,
        ["deriveBits"]
      );
      const newBits = await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          hash: "SHA-256",
          salt: enc.encode(newSalt),
          iterations: 100_000,
        },
        newKm,
        256
      );
      const newHash = toBase64(newBits);
      const password_hash = `${newSalt}:${newHash}`;

      await c.env.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?")
        .bind(password_hash, userId)
        .run();
      return c.json({ ok: true });
    } catch (err) {
      return c.json({ error: "invalid token" }, 401);
    }
  });

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

  // OAuth starter route: redirect to provider authorize URL if configured
  r.get("/oauth/:provider", async (c) => {
    const { provider } = c.req.param();
    if (provider === "github") {
      const clientId =
        (c.env as any).GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID;
      const redirectUri =
        (c.env as any).GITHUB_REDIRECT || process.env.GITHUB_REDIRECT;
      if (!clientId || !redirectUri)
        return c.json({ error: "OAuth not configured" }, 501);
      const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user user:email`;
      return c.redirect(url);
    }
    if (provider === "google") {
      const clientId =
        (c.env as any).GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
      const redirectUri =
        (c.env as any).GOOGLE_REDIRECT || process.env.GOOGLE_REDIRECT;
      if (!clientId || !redirectUri)
        return c.json({ error: "OAuth not configured" }, 501);
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&access_type=offline`;
      return c.redirect(url);
    }
    return c.json({ error: "provider not supported" }, 400);
  });

  // OAuth callback stub: exchange code for token (implement per provider)
  r.get("/oauth/:provider/callback", async (c) => {
    const { provider } = c.req.param();
    return c.json({ error: "Not implemented" }, 501);
  });

  return r;
}
