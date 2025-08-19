import ApiService from './api.service';



type ApiResponseList<T> = {
  data: T[];
  message: string;
  status: string;
  statusCode: number;
};

export type Revenue = {
  label: string;
  revenue: number;
};

export type GetRevenueQueries = {
  month?: string | number | null;
  year?: string | number | null;
};

class RevenueService {
  api: ApiService;

  constructor() {
    this.api = new ApiService('http://localhost:5000/api/dashboard');
  }

  async getRevenue({
    month,
    year,
  }: GetRevenueQueries): Promise<ApiResponseList<Revenue>> {
    const query: URLSearchParams = new URLSearchParams();

    if (month !== null && month !== undefined) {
      query.append('month', month.toString());
    }

    if (year !== null && year !== undefined) {
      query.append('year', year.toString());
    }

    const queryString = query.toString();

    return this.api.get(`/revenue?${queryString}`);
  }
}

export default new RevenueService();
