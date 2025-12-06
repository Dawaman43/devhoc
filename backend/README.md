# Devhoc Backend (Cloudflare Workers + Hono)

Backend skeleton for Dev Q&A platform.

## Stack

- Hono (Cloudflare Workers)
- D1 (SQLite on Workers) for DB
- R2 for uploads (optional)
- TypeScript + Wrangler

## Env & Config

- Configure `wrangler.toml` bindings for `DB`, `BUCKET`, `JWT_SECRET`.
- Update `database_id` and `bucket_name` to your actual resources.

## Run Locally

```bash
cd backend
npm install
npm run dev
```

Dev server runs at `http://localhost:8787`.

## Deploy

```bash
npm run deploy
```

## Routes

- `GET /health`
- `POST /auth/register` | `POST /auth/login` | `POST /auth/logout`
- `GET /posts` | `POST /posts` | `GET /posts/:postId` | `PUT /posts/:postId` | `DELETE /posts/:postId`
- `GET /comments` | `POST /comments` | `POST /comments/reply`
- `POST /votes`

## Database

- See `db/schema.sql`
- Apply via `wrangler d1 execute devhoc-db --file db/schema.sql`

## Next Steps

- Implement D1 queries in route handlers
- Add Zod validation details and auth guard middleware
- Add search endpoints and indexing strategy
- Optional: notifications and uploads via R2
