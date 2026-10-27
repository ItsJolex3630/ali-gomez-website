import { requireAdmin } from '../_shared/auth';
import { getDb, HttpError, json, num, readBody, route, str, type Env } from '../_shared/turso';

const CATEGORIES = new Set(['bodas', 'corp', 'producto', 'eventos', 'retratos', 'video']);

export const onRequestGet = route<Env>(async ({ env }) => {
  if (!env.TURSO_URL || !env.TURSO_AUTH_TOKEN) {
    return json(
      { ok: true, photos: [] },
      { headers: { 'cache-control': 'public, max-age=30' } },
    );
  }

  const db = getDb(env);
  const result = await db.execute(
    'SELECT id, title, category, alt, src, width, height, sort_order, created_at FROM photos WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC;',
  );

  const photos = result.rows.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    category: String(row.category),
    alt: row.alt == null ? '' : String(row.alt),
    src: String(row.src),
    width: row.width == null ? null : Number(row.width),
    height: row.height == null ? null : Number(row.height),
    sort_order: Number(row.sort_order) || 0,
    created_at: row.created_at == null ? '' : String(row.created_at),
  }));

  return json(
    { ok: true, photos },
    { headers: { 'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600' } },
  );
});

export const onRequestPost = route<Env>(async ({ request, env }) => {
  await requireAdmin(request, env);
  if (!env.TURSO_URL || !env.TURSO_AUTH_TOKEN) {
    throw new HttpError(503, 'Base de datos Turso no configurada en Cloudflare Pages.');
  }

  const body = await readBody<Record<string, unknown>>(request);
  const title = str(body.title, 'title', { required: true, max: 120 });
  const category = str(body.category, 'category', { required: true });
  if (!CATEGORIES.has(category)) throw new HttpError(400, 'Categoría no válida.');

  const alt = str(body.alt, 'alt', { max: 180 }) || title;
  const src = str(body.src, 'src', { required: true });
  if (!/^(data:image\/|https?:\/\/)/i.test(src)) throw new HttpError(400, 'src debe ser una imagen válida.');

  const width = num(body.width, 'width', { integer: true, min: 1, max: 20000 });
  const height = num(body.height, 'height', { integer: true, min: 1, max: 20000 });
  const sortOrder = num(body.sort_order, 'sort_order', { integer: true, min: 0, max: 1000000 }) ?? 0;

  const id = `ph_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const db = getDb(env);
  await db.execute({
    sql: 'INSERT INTO photos (id, title, category, alt, src, width, height, sort_order, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);',
    args: [id, title, category, alt, src, width, height, sortOrder],
  });

  return json(
    { ok: true, photo: { id, title, category, alt, src, width, height } },
    { status: 201, headers: { 'cache-control': 'no-store' } },
  );
});

export const onRequestDelete = route<Env>(async ({ request, env }) => {
  await requireAdmin(request, env);
  if (!env.TURSO_URL || !env.TURSO_AUTH_TOKEN) {
    throw new HttpError(503, 'Base de datos Turso no configurada en Cloudflare Pages.');
  }

  let id = new URL(request.url).searchParams.get('id') || '';
  if (id) {
    id = str(id, 'id', { required: true, max: 120 });
  } else {
    const body = await readBody<{ id?: unknown }>(request);
    id = str(body.id, 'id', { required: true, max: 120 });
  }

  const db = getDb(env);
  await db.execute({ sql: 'DELETE FROM photos WHERE id = ?;', args: [id] });

  return json({ ok: true, deleted: id }, { headers: { 'cache-control': 'no-store' } });
});
