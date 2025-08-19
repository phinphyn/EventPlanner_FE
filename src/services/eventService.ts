import type { StepFormData } from '@/context/StepFormContext';
import ApiService from './api.service';
import type { UserInfoType } from './userService';
import type { Room } from './roomService';
import type { EventType } from './eventType.service';
import type { Service } from './serviceService';
import type { EventStatusUpdate } from '@/pages/admin/components/EventDetailModel';
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

// interface Account {
//   account_id: number;
//   account_name: string;
// }

// interface Room {
//   room_id: number;
//   room_name: string;
//   is_active: boolean;
// }

// interface EventType {
//   type_id: number;
//   type_name: string;
//   is_active: boolean;
// }

// interface Service {
//   service_id: number;
//   service_name: string;
//   description: string;
//   is_active: boolean;
// }

type Variation = {
  variation_id: number;
  variation_name: string;
  base_price: string;
  duration_hours: number;
  is_active: boolean;
};

type EventServiceType = {
  service_id: number;
  variation_id: number;
  service: Service;
  variation: Variation;
};

export interface Event {
  event_id: string | number;
  event_name: string;
  description: string;
  account_id: string | number;
  status: string;
  event_date: string;
  start_time: string;
  end_time: string;
  estimated_cost: string;
  room_service_fee?: string | null;
  final_cost?: string | null;
  room_id: string | number;
  event_type_id: string | number;
  account?: UserInfoType;
  room?: Room;
  event_type?: EventType;
  event_services?: EventServiceType[];
  eventServicesCount?: string | number;
  date_create?: string;
  updated_at?: string;
}

export type GetEventQueryType = {
  account_id?: string | number;
  room_id?: string | number;
  event_type_id?: string | number;
  status?: string;
  dateMin?: string;
  dateMax?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  includeAccount?: string | boolean;
  includeRoom?: string | boolean;
  includeEventType?: string | boolean;
  includeEventServices?: string | boolean;
};

class EventService {
  api: ApiService;

  constructor() {
    this.api = new ApiService('http://localhost:5000/api/events');
  }

  async createEvent(data: StepFormData): Promise<ApiResponse<Event>> {
    return this.api.request<ApiResponse<Event>>('/', 'POST', data, {
      'Content-Type': 'application/json',
    });
  }

  async getAllEvents(
    queries?: GetEventQueryType,
  ): Promise<ApiResponse<Event[]>> {
    const query: GetEventQueryType = {};

    console.log(queries);

    if (
      queries?.includeAccount !== undefined &&
      queries?.includeAccount !== null
    ) {
      query.includeAccount = queries?.includeAccount;
    }

    if (queries?.includeRoom !== undefined && queries?.includeRoom !== null) {
      query.includeRoom = queries?.includeRoom;
    }

    if (
      queries?.includeEventType !== undefined &&
      queries?.includeEventType !== null
    ) {
      query.includeEventType = queries?.includeEventType;
    }

    if (
      queries?.includeEventServices !== undefined &&
      queries?.includeEventServices !== null
    ) {
      query.includeEventServices = queries?.includeEventServices;
    }

    if (queries?.sortBy) {
      query.sortBy = queries.sortBy;
    }

    if (queries?.sortOrder) {
      query.sortOrder = queries.sortOrder;
    }

    return this.api.request(
      `/?${new URLSearchParams(query).toString()}`,
      'GET',
    );
  }

  async getEventById(
    id: string,
    queries?: GetEventQueryType,
  ): Promise<ApiResponse<Event>> {
    const query: GetEventQueryType = {};

    if (
      queries?.includeAccount !== undefined &&
      queries?.includeAccount !== null
    ) {
      query.includeAccount = queries?.includeAccount;
    }

    if (queries?.includeRoom !== undefined && queries?.includeRoom !== null) {
      query.includeRoom = queries?.includeRoom;
    }

    if (
      queries?.includeEventType !== undefined &&
      queries?.includeEventType !== null
    ) {
      query.includeEventType = queries?.includeEventType;
    }

    if (
      queries?.includeEventServices !== undefined &&
      queries?.includeEventServices !== null
    ) {
      query.includeEventServices = queries?.includeEventServices;
    }

    return this.api.request<ApiResponse<Event>>(
      `/${id}?${new URLSearchParams(query).toString()}`,
      'GET',
    );
  }

  updateEventStatus(update: EventStatusUpdate) {
    return this.api.request<ApiResponse<Event>>(
      `/${update.eventId}/status`,
      'PATCH',
      { status: update.status },
    );
  }

  async toggleEventStatus(eventId: string | number) {
    return this.api.request<ApiResponse<Event>>(
      `/${eventId}/toggle-status`,
      'PATCH',
      null,
      {
        Authorization: `Bearer ${authService.getAccessToken()}`,
      },
    );
  }
}

export default new EventService();
