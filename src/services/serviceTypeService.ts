import ApiService from './api.service';

class ServiceTypeService {
  api: ApiService;

  constructor() {
    this.api = new ApiService('http://localhost:5000/api/service-types');
  }

  async getAllServiceTypes(params: Record<string, any> = {}): Promise<any> {
    const query = new URLSearchParams(params).toString();
    return this.api.request(query ? `/?${query}` : '/', 'GET');
  }

  async getServiceTypeById(id: string): Promise<any> {
    return this.api.request(`/${id}`, 'GET');
  }

  async createServiceType(data: any): Promise<any> {
    return this.api.request('/', 'POST', data);
  }

  async updateServiceType(id: string, data: any): Promise<any> {
    return this.api.request(`/${id}`, 'PUT', data);
  }

  async deleteServiceType(id: string): Promise<any> {
    return this.api.request(`/${id}`, 'DELETE');
  }
}

export default new ServiceTypeService();
