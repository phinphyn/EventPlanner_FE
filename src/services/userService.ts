import ApiService from './api.service';
import authService from './authService';

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

export type UserInfoType = {
  account_id: number;
  account_name: string;
  avatar_url?: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  gender?: string;
  role?: string;
};

class UserService {
  api: ApiService;

  constructor() {
    this.api = new ApiService('http://localhost:5000/api/accounts');
  }

  async getUserInfo(): Promise<ApiResponse<UserInfoType>> {
    return this.api.request<ApiResponse<UserInfoType>>(
      `/my-profile`,
      'GET',
      null,
      {
        Authentication: `Bearer ${authService.getAccessToken()}`,
      },
    );
  }

  async updatePassword(currentPassword: string, newPassword: string) {
    const account: UserInfoType = JSON.parse(
      localStorage.getItem('user') || 'null',
    );

    return this.api.request<ApiResponse<null>>(
      `/${account.account_id}/password`,
      'PUT',
      {
        currentPassword,
        newPassword,
      },
      {
        Authorization: `Bearer ${authService.getAccessToken()}`,
      },
    );
  }
}

export default new UserService();
