import envConstant from '../constant/env.constant.mjs';

export const DEFAULT_FALLBACK_ORIGIN = 'https://growrichmindset.in';

export const DEFAULT_ALLOWED_ORIGINS = Object.freeze([
  'https://growrichmindset.in',
  'http://growrichmindset.in',
  'https://www.growrichmindset.in',
  'http://www.growrichmindset.in',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:1420',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:1420',
  'tauri://localhost',
  'http://tauri.localhost',
  'https://tauri.localhost',
]);

/**
 * Checks if a string is a valid non-placeholder origin.
 * @param {string} val
 * @returns {boolean}
 */
export const isValidOriginFormat = (val) => {
  if (!val || typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (
    trimmed.startsWith('#') ||
    trimmed.includes(' ') ||
    trimmed === 'null' ||
    trimmed === 'undefined'
  ) {
    return false;
  }
  return /^https?:\/\/|^tauri:\/\//i.test(trimmed);
};

/**
 * Normalizes an origin string by trimming whitespace and removing trailing slashes.
 * @param {string} origin
 * @returns {string}
 */
export const normalizeOrigin = (origin) => {
  if (!origin || typeof origin !== 'string') return '';
  return origin.trim().replace(/\/+$/, '');
};

/**
 * Resolves the primary fallback URL, ensuring placeholders are replaced with DEFAULT_FALLBACK_ORIGIN.
 * @returns {string}
 */
export const getFallbackOrigin = () => {
  const envUrl = process.env.FRONTEND_URL;
  if (envUrl && isValidOriginFormat(envUrl)) {
    return normalizeOrigin(envUrl);
  }
  return DEFAULT_FALLBACK_ORIGIN;
};

/**
 * Retrieves the list of allowed origins parsed from ALLOWED_ORIGINS env variable,
 * falling back to defaults if not set.
 * @returns {string[]}
 */
export const getAllowedOrigins = () => {
  const rawAllowed =
    process.env.ALLOWED_ORIGINS || envConstant.ALLOWED_ORIGINS || '';
  const fallbackUrl = getFallbackOrigin();

  const set = new Set([...DEFAULT_ALLOWED_ORIGINS]);

  if (rawAllowed && typeof rawAllowed === 'string') {
    rawAllowed
      .split(',')
      .map((entry) => normalizeOrigin(entry))
      .filter((entry) => isValidOriginFormat(entry))
      .forEach((entry) => set.add(entry));
  }

  const cleanFallback = normalizeOrigin(fallbackUrl);
  if (cleanFallback && isValidOriginFormat(cleanFallback)) {
    set.add(cleanFallback);
  }

  return Array.from(set);
};

/**
 * Checks if a given origin is present in the allowlist or matches trusted domain patterns.
 * @param {string} origin
 * @returns {boolean}
 */
export const isOriginAllowed = (origin) => {
  if (!origin || typeof origin !== 'string') return false;
  const clean = normalizeOrigin(origin);
  if (!isValidOriginFormat(clean)) return false;

  const allowed = getAllowedOrigins();
  if (allowed.includes(clean)) return true;

  // Domain pattern matching for subdomains, ports, and hosting platforms
  try {
    const url = new URL(clean);
    const hostname = url.hostname.toLowerCase();

    // Match growrichmindset.in and all subdomains (www, dev, api, etc.)
    if (
      hostname === 'growrichmindset.in' ||
      hostname.endsWith('.growrichmindset.in')
    ) {
      return true;
    }

    // Match eduvanta domains
    if (hostname.includes('eduvanta')) {
      return true;
    }

    // Match Cloud deploy previews (onrender.com, vercel.app, netlify.app)
    if (
      hostname.endsWith('.onrender.com') ||
      hostname.endsWith('.vercel.app') ||
      hostname.endsWith('.netlify.app')
    ) {
      return true;
    }
  } catch {
    // Non-standard protocols (e.g. tauri://localhost)
    if (clean.startsWith('tauri://') || clean.includes('tauri.localhost')) {
      return true;
    }
  }

  return false;
};

/**
 * Reads the request's Origin header, validates it against ALLOWED_ORIGINS, and returns it.
 * Falls back to https://growrichmindset.in (or FRONTEND_URL) when the header is absent,
 * or when an unvalidated/disallowed origin is provided (preventing open-redirect vulnerabilities).
 *
 * @param {import('express').Request|object} req
 * @returns {string}
 */
export const resolveFrontendOrigin = (req) => {
  const fallback = getFallbackOrigin();

  if (!req) return fallback;

  // Extract Origin header (case-insensitive across HTTP frameworks)
  const originHeader =
    (typeof req.get === 'function' ? req.get('origin') : null) ||
    req.headers?.origin ||
    req.headers?.Origin;

  if (originHeader && typeof originHeader === 'string') {
    const cleanOrigin = normalizeOrigin(originHeader);
    if (isOriginAllowed(cleanOrigin)) {
      return cleanOrigin;
    }

    // Log rejected origins in development
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[Origin Resolution] Rejected untrusted origin header "${originHeader}". Safe fallback used: "${fallback}"`
      );
    }
    return fallback;
  }

  // When no Origin header is present (e.g. curl, SSR, native calls)
  return fallback;
};

/**
 * Creates options object for the express `cors` middleware.
 * @returns {import('cors').CorsOptions}
 */
export const createCorsOptions = () => {
  return {
    origin: (origin, callback) => {
      // Requests without origin header (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }
      const clean = normalizeOrigin(origin);
      if (isOriginAllowed(clean)) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[CORS] Rejected origin: "${origin}"`);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-App-Version',
      'x-access-token',
      'token',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Range',
    ],
    exposedHeaders: ['set-cookie', 'Content-Range', 'X-Total-Count'],
    optionsSuccessStatus: 204,
  };
};

export default {
  DEFAULT_FALLBACK_ORIGIN,
  DEFAULT_ALLOWED_ORIGINS,
  normalizeOrigin,
  getAllowedOrigins,
  isOriginAllowed,
  resolveFrontendOrigin,
  createCorsOptions,
};
