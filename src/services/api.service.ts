import authService from './authService';

type RequestHeaders = Record<string, string>;

export type ApiResponse<T> = {
  data: T;
  message: string;
  meta?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  status: string;
  statusCode: number;
};

class ApiService {
  baseUrl: string;
  authService: typeof authService;

  constructor(baseUrl = import.meta.env.VITE_API_BASE_URL) {
    this.baseUrl = baseUrl || 'http://localhost:5000/api';
    this.authService = authService;
  }

  async request<T = unknown>(
    endpoint: string,
    method: string = 'GET',
    body: unknown = null,
    headers: RequestHeaders = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const accessToken = this.authService.getAccessToken();

    const options: RequestInit & { headers: RequestHeaders } = {
      method,
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
        ...headers,
      },
    };

    if (body instanceof FormData) {
      options.body = body;
      delete options.headers['Content-Type'];
    } else if (body && method !== 'GET' && method !== 'HEAD') {
      options.body = JSON.stringify(body);
      options.headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (data.error) {
        console.log(data.error);
        throw new Error(data.error || 'Error on fetching data');
      }

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  get<T = unknown>(endpoint: string, headers: RequestHeaders = {}) {
    return this.request<T>(endpoint, 'GET', null, headers);
  }

  post<T = unknown>(
    endpoint: string,
    body: unknown,
    headers: RequestHeaders = {},
  ) {
    return this.request<T>(endpoint, 'POST', body, headers);
  }

  put<T = unknown>(
    endpoint: string,
    body: unknown,
    headers: RequestHeaders = {},
  ) {
    return this.request<T>(endpoint, 'PUT', body, headers);
  }

  delete<T = unknown>(endpoint: string, headers: RequestHeaders = {}) {
    return this.request<T>(endpoint, 'DELETE', null, headers);
  }
}

export default ApiService;
