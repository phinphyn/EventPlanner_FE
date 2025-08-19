import ApiService from './api.service';

export interface Room {
  room_id: number;
  room_name: string;
  status?: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'OCCUPIED' | 'RESERVED';
  guest_capacity?: number;
  base_price?: string;
  hourly_rate?: string | null;
  description?: string | null;
  amenities?: string[] | null;
  is_active: boolean;
  images?: RoomImage[];
  created_at?: string;
  updated_at?: string;
}

type RoomImage = {
  image_id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
};

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
  data: T[];
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

export type GetAllRoomQueries = {
  search?: string | null;
  status?:
    | 'AVAILABLE'
    | 'BOOKED'
    | 'MAINTENANCE'
    | 'OCCUPIED'
    | 'RESERVED'
    | null;
  isActive?: boolean | null;
  includeInactive?: boolean | null;
  guestCapacityMin?: number | null;
  guestCapacityMax?: number | null;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeEvents?: boolean | null;
  includeImages?: boolean | null;
};

class RoomService {
  api: ApiService;

  constructor() {
    this.api = new ApiService('http://localhost:5000/api/rooms');
  }

  async createRoom(data: Omit<Room, 'type_id'>): Promise<Room> {
    return this.api.request<Room>('/', 'POST', data, {
      'Content-Type': 'application/json',
    });
  }

  async getAllRooms(
    queries?: GetAllRoomQueries,
  ): Promise<ApiResponseList<Room>> {
    const queryString = new URLSearchParams({
      search: queries?.search || '',
      status: queries?.status || '',
      isActive:
        queries?.isActive !== null || queries?.isActive !== undefined
          ? String(queries?.isActive)
          : '',
      includeInactive:
        queries?.includeInactive !== null &&
        queries?.includeInactive !== undefined
          ? String(queries?.includeInactive)
          : '',
      guestCapacityMin:
        queries?.guestCapacityMin !== null &&
        queries?.guestCapacityMin !== undefined
          ? String(queries?.guestCapacityMin)
          : '',
      guestCapacityMax:
        queries?.guestCapacityMax !== null &&
        queries?.guestCapacityMax !== undefined
          ? String(queries?.guestCapacityMax)
          : '',
      page: String(queries?.page),
      limit: String(queries?.limit),
      sortBy: queries?.sortBy || '',
      sortOrder: queries?.sortOrder || 'asc',
      includeEvents:
        queries?.includeEvents !== null ? String(queries?.includeEvents) : '',
      includeImages:
        queries?.includeImages !== null ? String(queries?.includeImages) : '',
    }).toString();

    return this.api.request(`/?${queryString}`, 'GET');
  }

  async getRoomById(id: string): Promise<ApiResponseSingle<Room>> {
    return this.api.request<ApiResponseSingle<Room>>(`/${id}`, 'GET');
  }

  async updateRoom(id: string, data: any): Promise<any> {
    return this.api.request(`/${id}`, 'PUT', data);
  }

  async deleteRoom(id: string): Promise<any> {
    return this.api.request(`/${id}`, 'DELETE');
  }
}

export default new RoomService();
