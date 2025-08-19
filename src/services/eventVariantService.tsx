import ApiService from './api.service';

type ApiResponse<T> = {
  data: {
    variations: T[];
  };
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

export type PricingTier = {
  tier_id: number;
  price_modifier: string;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
  variation_id: number;
};

export type ServiceInVariant = {
  service_id: number;
  service_name: string;
  is_active: boolean;
  is_available: boolean;
};

export type ServiceVariant = {
  variation_id: number;
  variation_name: string;
  base_price: string;
  duration_hours: number;
  is_active: boolean;
  updated_at: string;
  service_id: number;
  image_url: string;
  image_public_id: string;
  service: ServiceInVariant;
  pricing_tiers: PricingTier[];
  pricingTiersCount: number;
  transformedImageUrl: string;
};

export type ServiceVariantQuery = {
  service_id?: string;
  isActive?: string;
  includeInactive?: string;
  priceMin?: string;
  priceMax?: string;
  durationMin?: string;
  durationMax?: string;
  search?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  includeService?: string;
  includePricingTiers?: string;
};

class ServiceVariantService {
  api: ApiService;

  constructor() {
    this.api = new ApiService('http://localhost:5000/api/variations');
  }

  async getAllServiceVariants(
    query: ServiceVariantQuery,
  ): Promise<ApiResponse<ServiceVariant>> {
    const queries = new URLSearchParams();

    if (query.service_id !== null && query.service_id !== undefined) {
      queries.append('service_id', query.service_id);
    }

    if (query.isActive !== null && query.isActive !== undefined) {
      queries.append('isActive', query.isActive);
    }

    if (query.includeInactive !== null && query.includeInactive !== undefined) {
      queries.append('includeInactive', query.includeInactive);
    }

    if (query.priceMin !== null && query.priceMin !== undefined) {
      queries.append('priceMin', query.priceMin);
    }

    if (query.priceMax !== null && query.priceMax !== undefined) {
      queries.append('priceMax', query.priceMax);
    }

    if (query.durationMin !== null && query.durationMin !== undefined) {
      queries.append('durationMin', query.durationMin);
    }

    if (query.durationMax !== null && query.durationMax !== undefined) {
      queries.append('durationMax', query.durationMax);
    }

    if (query.search !== null && query.search !== undefined) {
      queries.append('search', query.search);
    }

    if (query.page !== null && query.page !== undefined) {
      queries.append('page', query.page);
    }

    if (query.limit !== null && query.limit !== undefined) {
      queries.append('limit', query.limit);
    }

    if (query.sortBy !== null && query.sortBy !== undefined) {
      queries.append('sortBy', query.sortBy);
    }

    if (query.sortOrder !== null && query.sortOrder !== undefined) {
      queries.append('sortOrder', query.sortOrder);
    }

    if (query.includeService !== null && query.includeService !== undefined) {
      queries.append('includeService', query.includeService);
    }

    if (
      query.includePricingTiers !== null &&
      query.includePricingTiers !== undefined
    ) {
      queries.append('includePricingTiers', query.includePricingTiers);
    }

    return this.api.request(`/?${queries.toString()}`, 'GET');
  }
}
export default new ServiceVariantService();
