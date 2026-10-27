import { HttpError, type Env } from './turso';

export const ADMIN_WHITELIST = ['niquitao83@gmail.com', 'jolex3630@gmail.com'];

export const SESSION_COOKIE = 'ali_admin_session';

const SESSION_MAX_AGE = 2592000;
const DEFAULT_SECRET = 'ali-gomez-session-secret-key-2026';

export interface SessionUser {
  email: string;
  name: string;
  role: string;
}

interface SessionPayload extends SessionUser {
  exp: number;
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(env: Env): Promise<CryptoKey> {
  const secret = env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function readCookie(header: string, name: string): string | null {
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    if (part.slice(0, index).trim() === name) return part.slice(index + 1).trim();
  }
  return null;
}

export async function createSessionCookie(env: Env, user: { email: string; name: string }): Promise<string> {
  const payload: SessionPayload = {
    email: user.email.toLowerCase(),
    name: user.name,
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const encoded = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(env), new TextEncoder().encode(encoded));
  const token = `${encoded}.${encodeBase64Url(new Uint8Array(signature))}`;
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_MAX_AGE}; HttpOnly; Secure; SameSite=Strict`;
}

export async function verifySession(request: Request, env: Env): Promise<SessionUser | null> {
  const token = readCookie(request.headers.get('cookie') || '', SESSION_COOKIE);
  if (!token) return null;

  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  try {
    const valid = await crypto.subtle.verify(
      'HMAC',
      await hmacKey(env),
      decodeBase64Url(signature),
      new TextEncoder().encode(encoded),
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encoded))) as SessionPayload;
    if (!payload.email || typeof payload.exp !== 'number') return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;

    return {
      email: payload.email.toLowerCase(),
      name: typeof payload.name === 'string' ? payload.name : '',
      role: typeof payload.role === 'string' ? payload.role : 'admin',
    };
  } catch {
    return null;
  }
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`;
}

export async function requireAdmin(request: Request, env: Env): Promise<{ email: string; name: string }> {
  const session = await verifySession(request, env);
  if (!session) throw new HttpError(401, 'Sesión no válida o expirada.');
  if (session.role !== 'admin' || !ADMIN_WHITELIST.includes(session.email)) {
    throw new HttpError(403, 'Acceso denegado: tu correo no está autorizado como administrador.');
  }
  return { email: session.email, name: session.name };
}
