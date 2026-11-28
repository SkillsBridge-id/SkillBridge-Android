const DEFAULT_API_BASE_URL = 'http://localhost:8787';

const apiBaseUrl = (
  process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, '');

/**
 * @type {{
 *   getAccessToken: () => Promise<string | null>,
 *   refreshAccessToken: () => Promise<string | null>,
 *   onUnauthorized?: () => void,
 * }}
 */
let authProvider = {
  getAccessToken: async () => null,
  refreshAccessToken: async () => null,
};

export class ApiError extends Error {
  /**
   * @param {{ code?: string, message: string, requestId?: string, status: number }} details
   */
  constructor({ code = 'REQUEST_FAILED', message, requestId, status }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.requestId = requestId;
    this.status = status;
  }
}

/**
 * Connect this once Supabase Auth is configured. Both functions must return a
 * Supabase access token, never an ID token or refresh token.
 *
 * @param {{
 *   getAccessToken: () => Promise<string | null>,
 *   refreshAccessToken?: () => Promise<string | null>,
 *   onUnauthorized?: () => void,
 * }} provider
 */
export function configureApiAuth(provider) {
  authProvider = {
    getAccessToken: provider.getAccessToken,
    refreshAccessToken: provider.refreshAccessToken ?? provider.getAccessToken,
    onUnauthorized: provider.onUnauthorized,
  };
}

export function getApiBaseUrl() {
  return apiBaseUrl;
}

/**
 * @template T
 * @param {string} path
 * @param {{ auth?: boolean, body?: unknown, method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', signal?: AbortSignal }} [options]
 * @returns {Promise<T>}
 */
export async function apiRequest(path, options = {}) {
  const { auth = false, body, method = 'GET', signal } = options;
  let accessToken = auth ? await authProvider.getAccessToken() : null;
  let hasRefreshed = false;

  while (true) {
    /** @type {Record<string, string>} */
    const headers = { Accept: 'application/json' };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${apiBaseUrl}${path}`, {
      body: body === undefined ? undefined : JSON.stringify(body),
      headers,
      method,
      signal,
    });

    if (response.status === 401 && auth && !hasRefreshed) {
      hasRefreshed = true;
      accessToken = await authProvider.refreshAccessToken();

      if (accessToken) {
        continue;
      }
    }

    const payload = await readJson(response);

    if (response.status === 401 && auth) {
      authProvider.onUnauthorized?.();
    }

    if (!response.ok || !payload?.success) {
      const error = payload?.error;
      throw new ApiError({
        code: error?.code,
        message: error?.message ?? `Request failed with status ${response.status}`,
        requestId: payload?.requestId,
        status: response.status,
      });
    }

    return payload.data;
  }
}

/**
 * Operational health endpoints return their payload directly without the API envelope.
 *
 * @template T
 * @param {string} path
 * @param {AbortSignal} [signal]
 * @returns {Promise<T>}
 */
export async function apiRawRequest(path, signal) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { Accept: 'application/json' },
    method: 'GET',
    signal,
  });

  const payload = await readJson(response);

  if (!response.ok) {
    throw new ApiError({
      code: payload?.error?.code,
      message: payload?.error?.message ?? `Request failed with status ${response.status}`,
      requestId: payload?.requestId,
      status: response.status,
    });
  }

  return payload;
}

/** @param {Response} response */
async function readJson(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError({
      code: 'INVALID_RESPONSE',
      message: 'The server returned an invalid response.',
      status: response.status,
    });
  }
}
