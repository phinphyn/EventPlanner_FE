import type { EventStatusUpdate } from '@/pages/admin/components/EventDetailModel';
import type { Event, GetEventQueryType } from '@/services/eventService';
import eventService from '@/services/eventService';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

export function useEventManagement(initialEvents: Event[] = []) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const updateEventStatus = useCallback(async (update: EventStatusUpdate) => {
    setIsLoading(true);
    try {
      // await eventApi.updateEventStatus(update)
      console.log(update);

      if (!update.eventId || !update.status) {
        toast.error('Dữ liệu không hợp lệ');
        return;
      }

      if (update.status === 'CONFIRMED') {
        eventService.toggleEventStatus(update.eventId);
      } else {
        eventService.updateEventStatus(update);
      }

      // KIP THI SUAAAAAAAAAAAAA
      window.location.reload();

      toast('Cập nhật thành công');
    } catch (error) {
      toast('Cập nhật thất bại');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getEventHistory = useCallback(async (): Promise<Event[]> => {
    try {
      const queries: GetEventQueryType = {
        includeAccount: true,
        includeRoom: true,
        includeEventType: true,
        includeEventServices: true,
      };

      console.log(queries);

      const response = await eventService.getAllEvents(queries);
      return response.data || [];
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Cập nhật thất bại');
      return [];
    }
  }, []);

  const getEventStats = useCallback(() => {
    const stats = {
      total: events.length,
      PENDING: events.filter((e) => e.status === 'PENDING').length,
      CONFIRMED: events.filter((e) => e.status === 'CONFIRMED').length,
      IN_PROGRESS: events.filter((e) => e.status === 'IN_PROGRESS').length,
      CANCELLED: events.filter((e) => e.status === 'CANCELLED').length,
      COMPLETED: events.filter((e) => e.status === 'COMPLETED').length,
    };
    return stats;
  }, [events]);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  return {
    events,
    setEvents,
    isLoading,
    selectedEvents,
    setSelectedEvents,
    updateEventStatus,
    getEventHistory,
    getEventStats,
  };
}
