import { ADMIN_WHITELIST, createSessionCookie } from '../_shared/auth';
import { HttpError, json, readBody, route, str, type Env } from '../_shared/turso';

const DEFAULT_CLIENT_ID = '368451259646-lvkp7q372m712rsj2adbidam4d72g4m0.apps.googleusercontent.com';

interface GoogleTokenInfo {
  email?: unknown;
  email_verified?: unknown;
  name?: unknown;
  picture?: unknown;
  aud?: unknown;
}

export const onRequestPost = route<Env>(async ({ request, env }) => {
  const body = await readBody<{ credential?: unknown }>(request);
  const credential = str(body.credential, 'credential', { required: true });

  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`, {
    headers: { accept: 'application/json' },
  });
  if (!response.ok) throw new HttpError(401, 'La credencial de Google no es válida o ha expirado.');

  const payload = (await response.json()) as GoogleTokenInfo;
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const verified = payload.email_verified === true || payload.email_verified === 'true';
  if (!email || !verified) throw new HttpError(401, 'Google no pudo verificar tu correo electrónico.');

  const clientId = env.GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID;
  if (payload.aud !== clientId) throw new HttpError(401, 'La credencial de Google no corresponde a este sitio.');

  if (!ADMIN_WHITELIST.includes(email)) {
    throw new HttpError(403, 'Acceso denegado: tu correo no está autorizado como administrador.');
  }

  const name = typeof payload.name === 'string' && payload.name.trim() ? payload.name.trim() : email.split('@')[0];
  const picture = typeof payload.picture === 'string' ? payload.picture : '';
  const cookie = await createSessionCookie(env, { email, name });

  return json(
    { ok: true, user: { email, name, picture } },
    { headers: { 'set-cookie': cookie, 'cache-control': 'no-store' } },
  );
});
