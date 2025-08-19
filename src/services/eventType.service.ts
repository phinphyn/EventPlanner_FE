import ApiService from './api.service';

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

export interface EventType {
  type_id: number;
  type_name: string;
  description?: string;
  is_active?: boolean;
}

class EventTypeService {
  api: ApiService;

  constructor() {
    this.api = new ApiService('http://localhost:5000/api/event-types');
  }

  async createEventType(data: Omit<EventType, 'type_id'>): Promise<EventType> {
    return this.api.request<EventType>('/', 'POST', data, {
      'Content-Type': 'application/json',
    });
  }

  async getAllEventTypes(): Promise<ApiResponse<EventType[]>> {
    return this.api.request('/', 'GET');
  }

  async getEventTypeById(id: string): Promise<ApiResponse<EventType>> {
    return this.api.request<ApiResponse<EventType>>(`/${id}`, 'GET');
  }
}

export default new EventTypeService();
