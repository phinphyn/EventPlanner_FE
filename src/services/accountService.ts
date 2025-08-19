import ApiService from './api.service';

export interface Account {
  account_id: number;
  username: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
  // add other relevant fields here
}

type ApiResponse<T> = {
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

interface PaginatedAccounts {
  accounts: Account[];
  totalCount: number;
  page: number;
  limit: number;
}

class AccountService {
  api: ApiService;

  constructor() {
    this.api = new ApiService('http://localhost:5000/api/accounts');
  }

  // Get accounts with optional filters, pagination
  async getAllAccounts(
    filters: Record<string, any> = {},
    page = 1,
    limit = 20,
  ): Promise<ApiResponse<PaginatedAccounts>> {
    // Compose query parameters for filtering and pagination
    const params = { ...filters, page: String(page), limit: String(limit) };
    const query = new URLSearchParams(params).toString();
    return this.api.request<ApiResponse<PaginatedAccounts>>(
      `/?${query}`,
      'GET',
    );
  }

  // Get account by ID
  async getAccountById(id: string): Promise<ApiResponse<Account>> {
    return this.api.request<ApiResponse<Account>>(`/${id}`, 'GET');
  }

  // Create a new account
  async createAccount(data: Partial<Account>): Promise<ApiResponse<Account>> {
    return this.api.request<ApiResponse<Account>>('/', 'POST', data, {
      'Content-Type': 'application/json',
    });
  }

  // Update an account by ID
  async updateAccount(
    id: string,
    data: Partial<Account>,
  ): Promise<ApiResponse<Account>> {
    return this.api.request<ApiResponse<Account>>(`/${id}`, 'PUT', data, {
      'Content-Type': 'application/json',
    });
  }

  // Delete an account by ID
  async deleteAccount(id: string): Promise<ApiResponse<null>> {
    return this.api.request<ApiResponse<null>>(`/${id}`, 'DELETE');
  }
}

export default new AccountService();
