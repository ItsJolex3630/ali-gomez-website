import { createClient, type Client } from '@libsql/client/web';

export interface Env {
  TURSO_URL: string;
  TURSO_AUTH_TOKEN: string;
  ADMIN_SESSION_SECRET: string;
  GOOGLE_CLIENT_ID: string;
}

export interface Ctx<E extends Env = Env> {
  request: Request;
  env: E;
  params: Record<string, string | string[]>;
  data?: Record<string, unknown>;
  next?: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  waitUntil?: (promise: Promise<unknown>) => void;
}

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

let db: Client | null = null;

export function getDb(env: Env): Client {
  if (!db) {
    if (!env.TURSO_URL || !env.TURSO_AUTH_TOKEN) {
      throw new HttpError(500, 'La conexión con Turso no está configurada.');
    }
    db = createClient({ url: env.TURSO_URL, authToken: env.TURSO_AUTH_TOKEN });
  }
  return db;
}

export function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  if (!headers.has('content-type')) headers.set('content-type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(data), { ...init, headers });
}

export async function readBody<T = Record<string, unknown>>(request: Request): Promise<T> {
  const text = await request.text();
  if (!text.trim()) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(400, 'El cuerpo de la solicitud debe ser JSON válido.');
  }
}

export function str(value: unknown, field: string, options: { required?: boolean; max?: number } = {}): string {
  if (value === undefined || value === null) {
    if (options.required) throw new HttpError(400, `${field} es obligatorio.`);
    return '';
  }
  if (typeof value !== 'string') throw new HttpError(400, `${field} debe ser un texto.`);
  const text = value.trim();
  if (options.required && !text) throw new HttpError(400, `${field} es obligatorio.`);
  if (options.max && text.length > options.max) throw new HttpError(400, `${field} no puede superar ${options.max} caracteres.`);
  return text;
}

export function num(value: unknown, field: string, options: { required?: boolean; integer?: boolean; min?: number; max?: number } = {}): number | null {
  if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) {
    if (options.required) throw new HttpError(400, `${field} es obligatorio.`);
    return null;
  }
  const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
  if (!Number.isFinite(number)) throw new HttpError(400, `${field} debe ser un número válido.`);
  if (options.integer && !Number.isInteger(number)) throw new HttpError(400, `${field} debe ser un número entero.`);
  if (options.min !== undefined && number < options.min) throw new HttpError(400, `${field} no puede ser menor que ${options.min}.`);
  if (options.max !== undefined && number > options.max) throw new HttpError(400, `${field} no puede ser mayor que ${options.max}.`);
  return number;
}

export function errorResponse(error: unknown): Response {
  if (error instanceof HttpError) {
    return json({ error: error.message }, { status: error.status, headers: { 'cache-control': 'no-store' } });
  }
  console.error('API error', error);
  return json({ error: 'Error interno del servidor.' }, { status: 500, headers: { 'cache-control': 'no-store' } });
}

type Handler<E extends Env = Env> = (ctx: Ctx<E>) => Response | Promise<Response>;

export function route<E extends Env = Env>(handler: Handler<E>): (ctx: Ctx<E>) => Promise<Response> {
  return async (ctx) => {
    try {
      return await handler(ctx);
    } catch (error) {
      return errorResponse(error);
    }
  };
}
