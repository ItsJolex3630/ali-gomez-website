import { verifySession } from '../_shared/auth';
import { json, route, type Env } from '../_shared/turso';

export const onRequestGet = route<Env>(async ({ request, env }) => {
  const user = await verifySession(request, env);
  if (!user) {
    return json({ ok: false, authenticated: false }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }
  return json({ ok: true, authenticated: true, user }, { headers: { 'cache-control': 'no-store' } });
});
