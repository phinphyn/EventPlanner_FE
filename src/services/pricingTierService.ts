import ApiService from './api.service';

class PricingTierService {
  api: ApiService;

  constructor() {
    this.api = new ApiService('http://localhost:5000/api/pricing-tiers');
  }

  async createPricingTier(data: any): Promise<any> {
    return this.api.request('/', 'POST', data);
  }
}

export default new PricingTierService();
