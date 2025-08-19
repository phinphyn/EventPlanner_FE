import ApiService from './api.service';

type ApiResponse<T> = {
  data: T;
  message: string;
  status: string;
  statusCode: number;
};

export interface EventServiceStats {
  totalEventServices: number;
  confirmedCount: number;
  pendingCount: number;
  cancelledCount: number;
  totalCustomPrice: number;
  mostPopularService: {
    service_id: number;
    service_name: string;
    count: number;
  } | null;
}

export interface PaymentStat {
  date: string;
  total: number;
}

export interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  paidInvoices: number;
  pendingInvoices: number;
  cancelledInvoices: number;
  overdueInvoices: number;
  refundedInvoices: number;
  totalPaidAmount: number;
  totalOverdueAmount: number;
}

export interface AnalyticsData {
  eventServiceStats: EventServiceStats;
  paymentStats: PaymentStat[];
  invoiceStats: InvoiceStats;
}

class AnalyticsService {
  api: ApiService;

  constructor() {
    this.api = new ApiService('http://localhost:5000/api/dashboard'); // base URL
  }

  async getAnalytics(): Promise<ApiResponse<AnalyticsData[]>> {
    return this.api.request('/admin', 'GET');
  }
}

export default new AnalyticsService();
