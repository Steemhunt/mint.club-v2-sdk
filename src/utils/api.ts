import fetch from 'cross-fetch';

export class ApiError {
  status: number;
  message: string;

  constructor({ status, message }: { status: number; message: string }) {
    this.status = status;
    this.message = message || 'An unexpected error occurred';
  }
}

interface FetchOptions extends RequestInit {
  prefixUrl?: string;
  timeout?: number;
}

async function handleResponse(response: Response) {
  const data = await response.json();
  const { ok, status } = response;

  if (ok) {
    return data;
  }

  const { message = 'An error occurred while fetching the data.' } = data;
  throw new ApiError({ status, message });
}

async function fetchWithTimeout(url: string, options: FetchOptions = {}) {
  const { timeout = 60000, prefixUrl = '', ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const fullUrl = prefixUrl ? `${prefixUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}` : url;
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      signal: controller.signal,
    });
    const data = await handleResponse(response);
    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const baseFetcher = {
  get: (url: string, options?: FetchOptions) => fetchWithTimeout(url, { ...options, method: 'GET' }),
  post: (url: string, options?: FetchOptions) => fetchWithTimeout(url, { ...options, method: 'POST' }),
  put: (url: string, options?: FetchOptions) => fetchWithTimeout(url, { ...options, method: 'PUT' }),
  delete: (url: string, options?: FetchOptions) => fetchWithTimeout(url, { ...options, method: 'DELETE' }),
};

export const api = {
  get: (url: string, options?: Omit<FetchOptions, 'prefixUrl'>) =>
    baseFetcher.get(url, { ...options, prefixUrl: 'https://mint.club/api' }),
  post: (url: string, options?: Omit<FetchOptions, 'prefixUrl'>) =>
    baseFetcher.post(url, { ...options, prefixUrl: 'https://mint.club/api' }),
  put: (url: string, options?: Omit<FetchOptions, 'prefixUrl'>) =>
    baseFetcher.put(url, { ...options, prefixUrl: 'https://mint.club/api' }),
  delete: (url: string, options?: Omit<FetchOptions, 'prefixUrl'>) =>
    baseFetcher.delete(url, { ...options, prefixUrl: 'https://mint.club/api' }),
};
