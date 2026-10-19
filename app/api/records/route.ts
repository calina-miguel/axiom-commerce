import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

const KINDS = new Set(["niches", "suppliers", "contacts", "products", "outreach", "campaigns", "content", "leads", "inbox", "orders", "subscribers", "payments", "channels"]);
const response = (body: unknown, status = 200) => Response.json(body, { status });

async function context() {
  const user = await getChatGPTUser();
  if (!user) return null;
  if (!env.DB) throw new Error("Database is unavailable");
  return { user, db: env.DB };
}

export async function GET(request: Request) {
  const ctx = await context();
  if (!ctx) return response({ error: "Sign in required" }, 401);
  const kind = new URL(request.url).searchParams.get("kind");
  if (!kind || !KINDS.has(kind)) return response({ error: "Invalid section" }, 400);
  const result = await ctx.db.prepare("SELECT id, kind, title, country, stage, data, created_at, updated_at FROM records WHERE owner_id = ? AND kind = ? ORDER BY updated_at DESC LIMIT 1000").bind(ctx.user.userId, kind).all();
  return response({ records: result.results.map((row) => ({ ...row, data: JSON.parse(String(row.data)) })) });
}

export async function POST(request: Request) {
  const ctx = await context();
  if (!ctx) return response({ error: "Sign in required" }, 401);
  if (Number(request.headers.get("content-length") ?? 0) > 100_000) return response({ error: "Record too large" }, 413);
  let body: { kind?: unknown; title?: unknown; country?: unknown; stage?: unknown; data?: unknown };
  try { body = await request.json(); } catch { return response({ error: "Invalid JSON" }, 400); }
  if (typeof body.kind !== "string" || !KINDS.has(body.kind)) return response({ error: "Invalid section" }, 400);
  if (typeof body.title !== "string" || !body.title.trim() || body.title.length > 200) return response({ error: "Title is required" }, 400);
  if (!body.data || typeof body.data !== "object" || Array.isArray(body.data) || JSON.stringify(body.data).length > 80_000) return response({ error: "Invalid fields" }, 400);
  if (body.country !== undefined && (typeof body.country !== "string" || body.country.length > 100)) return response({ error: "Invalid country" }, 400);
  if (body.stage !== undefined && (typeof body.stage !== "string" || body.stage.length > 60)) return response({ error: "Invalid stage" }, 400);
  const id = crypto.randomUUID();
  const now = Date.now();
  await ctx.db.prepare("INSERT INTO records (id, owner_id, kind, title, country, stage, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(id, ctx.user.userId, body.kind, body.title.trim(), body.country ?? null, body.stage ?? null, JSON.stringify(body.data), now, now).run();
  return response({ id }, 201);
}

export async function PUT(request: Request) {
  const ctx = await context();
  if (!ctx) return response({ error: "Sign in required" }, 401);
  let body: { id?: unknown; title?: unknown; country?: unknown; stage?: unknown; data?: unknown };
  try { body = await request.json(); } catch { return response({ error: "Invalid JSON" }, 400); }
  if (typeof body.id !== "string" || typeof body.title !== "string" || !body.title.trim() || body.title.length > 200 || !body.data || typeof body.data !== "object" || Array.isArray(body.data) || JSON.stringify(body.data).length > 80_000) return response({ error: "Invalid record" }, 400);
  const result = await ctx.db.prepare("UPDATE records SET title = ?, country = ?, stage = ?, data = ?, updated_at = ? WHERE id = ? AND owner_id = ?").bind(body.title.trim(), typeof body.country === "string" ? body.country.slice(0, 100) : null, typeof body.stage === "string" ? body.stage.slice(0, 60) : null, JSON.stringify(body.data), Date.now(), body.id, ctx.user.userId).run();
  return response({ updated: result.meta.changes > 0 }, result.meta.changes ? 200 : 404);
}

export async function DELETE(request: Request) {
  const ctx = await context();
  if (!ctx) return response({ error: "Sign in required" }, 401);
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return response({ error: "ID required" }, 400);
  const result = await ctx.db.prepare("DELETE FROM records WHERE id = ? AND owner_id = ?").bind(id, ctx.user.userId).run();
  return response({ deleted: result.meta.changes > 0 }, result.meta.changes ? 200 : 404);
}
