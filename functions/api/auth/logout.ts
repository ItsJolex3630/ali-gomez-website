import { clearSessionCookie } from '../_shared/auth';
import { json, route } from '../_shared/turso';

export const onRequestPost = route(() =>
  json({ ok: true }, { headers: { 'set-cookie': clearSessionCookie(), 'cache-control': 'no-store' } }),
);
