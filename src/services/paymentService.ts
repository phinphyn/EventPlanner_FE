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

export type PaymentCreationBody = {
  userId: number | string;
  event_id: number | string;
};

export type StripeSession = {
  id: string;
  url: string;
  success_url?: string;
  cancel_url?: string;
  payment_status?: string;
  metadata?: {
    userId?: number | string;
  };
};

export type PaymentCreationSessionResponse = {
  stripeSession: StripeSession;
  payment_id: number;
};

class PaymentService {
  api: ApiService;

  constructor() {
    this.api = new ApiService('http://localhost:5000/api/payments');
  }

  async createPaymentSession(payload: PaymentCreationBody) {
    return this.api.request<ApiResponse<PaymentCreationSessionResponse>>(
      `/stripe/checkout-session`,
      'POST',
      {
        ...payload,
      },
      {
        Authorization: `Bearer ${authService.getAccessToken()}`,
      },
    );
  }
}

export default new PaymentService();
