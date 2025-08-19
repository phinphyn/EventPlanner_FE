import ApiService from './api.service';

class VariationService {
  api: ApiService;

  constructor() {
    this.api = new ApiService('http://localhost:5000/api/variations');
  }

  async createVariation(data: any): Promise<any> {
    let headers = {};
    if (!(data instanceof FormData)) {
      headers = { 'Content-Type': 'application/json' };
    }
    return this.api.request('/', 'POST', data, headers);
  }
}

export default new VariationService();
