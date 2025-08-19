import ApiService from './api.service';

interface ServiceImage {
  image_url: string;
  alt_text?: string;
}

export interface Service {
  service_id: number | string;
  service_name: string;
  description?: string;
  setup_time?: number;
  is_available?: boolean;
  is_active?: boolean;
  updated_at?: string;
  service_type_id?: number | string;
  variationCount?: number | string;
  images?: ServiceImage[];
}

export type Filters = {
  applied: number | null;
  search: unknown;
};

export type ApiResponseSingle<T> = {
  data: T;
  message: string;
  status: string;
  statusCode: number;
};

export type ApiResponseList<T> = {
  data: {
    services: T[];
    filters: Filters;
  };
  message: string;
  meta: {
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

export type GetAllServiceQueries = {
  isActive?: boolean;
  isAvailable?: boolean;
  serviceTypeId?: number | null;
  includeInactive?: boolean;
  search?: string;
  searchFields?: string[];
  createdFrom?: Date | null;
  createdTo?: Date | null;
  updatedFrom?: Date | null;
  updatedTo?: Date | null;
  minRating?: number | null;
  maxRating?: number | null;
  hasReviews?: boolean | null;
  minSetupTime?: number | null;
  maxSetupTime?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  page?: number | null;
  limit?: number | null;
  sortBy?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
  includeStats?: boolean | null;
  includeReviews?: boolean | null;
  includeVariations?: boolean | null;
  includeImages?: boolean | null;
};

class ServiceService {
  api: ApiService;

  constructor() {
    this.api = new ApiService('http://localhost:5000/api/services');
  }

  async createService(data: any): Promise<any> {
    let headers = {};
    if (!(data instanceof FormData)) {
      headers = { 'Content-Type': 'application/json' };
    }
    return this.api.request('/', 'POST', data, headers);
  }

  async getAllServices(
    queries?: GetAllServiceQueries,
  ): Promise<ApiResponseList<Service>> {
    const params: Record<string, string> = {};

    if (queries?.isActive !== undefined && queries.isActive !== null) {
      params.isActive = String(queries.isActive);
    }

    if (queries?.isAvailable !== undefined && queries.isAvailable !== null) {
      params.isAvailable = String(queries.isAvailable);
    }

    if (
      queries?.serviceTypeId !== undefined &&
      queries.serviceTypeId !== null
    ) {
      params.serviceTypeId = String(queries.serviceTypeId);
    }

    if (
      queries?.includeInactive !== undefined &&
      queries.includeInactive !== null
    ) {
      params.includeInactive = String(queries.includeInactive);
    }

    if (queries?.search) {
      params.search = queries.search;
    }

    if (queries?.searchFields) {
      params.searchFields = queries.searchFields.join(',');
    }

    if (queries?.createdFrom) {
      params.createdFrom = queries.createdFrom.toISOString();
    }

    if (queries?.createdTo) {
      params.createdTo = queries.createdTo.toISOString();
    }

    if (queries?.updatedFrom) {
      params.updatedFrom = queries.updatedFrom.toISOString();
    }

    if (queries?.updatedTo) {
      params.updatedTo = queries.updatedTo.toISOString();
    }

    if (queries?.minRating !== undefined && queries.minRating !== null) {
      params.minRating = String(queries.minRating);
    }

    if (queries?.maxRating !== undefined && queries.maxRating !== null) {
      params.maxRating = String(queries.maxRating);
    }

    if (queries?.hasReviews !== undefined && queries.hasReviews !== null) {
      params.hasReviews = String(queries.hasReviews);
    }

    if (queries?.minSetupTime !== undefined && queries.minSetupTime !== null) {
      params.minSetupTime = String(queries.minSetupTime);
    }

    if (queries?.maxSetupTime !== undefined && queries.maxSetupTime !== null) {
      params.maxSetupTime = String(queries.maxSetupTime);
    }

    if (queries?.minPrice !== undefined && queries.minPrice !== null) {
      params.minPrice = String(queries.minPrice);
    }

    if (queries?.maxPrice !== undefined && queries.maxPrice !== null) {
      params.maxPrice = String(queries.maxPrice);
    }

    if (queries?.page !== undefined && queries.page !== null) {
      params.page = String(queries.page);
    }

    if (queries?.limit !== undefined && queries.limit !== null) {
      params.limit = String(queries.limit);
    }

    if (queries?.sortBy) {
      params.sortBy = queries.sortBy;
    }

    if (queries?.sortOrder) {
      params.sortOrder = queries.sortOrder;
    }

    if (queries?.includeStats !== undefined && queries.includeStats !== null) {
      params.includeStats = String(queries.includeStats);
    }

    if (
      queries?.includeReviews !== undefined &&
      queries.includeReviews !== null
    ) {
      params.includeReviews = String(queries.includeReviews);
    }

    if (
      queries?.includeVariations !== undefined &&
      queries.includeVariations !== null
    ) {
      params.includeVariations = String(queries.includeVariations);
    }

    if (
      queries?.includeImages !== undefined &&
      queries.includeImages !== null
    ) {
      params.includeImages = String(queries.includeImages);
    }

    const queryString = new URLSearchParams(params);

    return this.api.request<ApiResponseList<Service>>(
      `?${queryString.toString()}`,
      'GET',
    );
  }

  async getServiceById(id: string): Promise<ApiResponseSingle<Service>> {
    return this.api.request<ApiResponseSingle<Service>>(`/${id}`, 'GET');
  }

  async deleteService(id: string): Promise<any> {
    return this.api.request(`/${id}`, 'DELETE');
  }

  async updateService(id: number, data: any): Promise<any> {
    // If data is NOT FormData, send JSON content-type

    return this.api.request(`/${id}`, 'PUT', data);
  }
}

export default new ServiceService();
