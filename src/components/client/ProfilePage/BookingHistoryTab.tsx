import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, Calendar, MapPin, Eye } from 'lucide-react';
import type { Event, GetEventQueryType } from '@/services/eventService';
import eventService from '@/services/eventService';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import EventDetailModal from './EventDetailModal';

const BookingHistoryTab: React.FC = () => {
  const [bookings, setBookings] = React.useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNavigateToBookingPage = () => {
    // In a real Next.js app, you would use router.push('/booking') or Link component
    console.log('Navigate to booking page');
  };

  const handleViewDetail = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  const user =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : {};
  const accountId = user ? user.account_id : '1'; // Default account ID for demo

  const handleFetchBookings = React.useCallback(async () => {
    try {
      const query: GetEventQueryType = {
        account_id: accountId,
        includeRoom: true,
        includeAccount: true,
        includeEventType: true,
        includeEventServices: true,
        sortBy: 'date_create',
        sortOrder: 'desc',
      };

      const res = await eventService.getAllEvents(query);

      setBookings(res.data || []);
    } catch (error) {
      console.log(error);
    }
  }, [accountId]);

  useEffect(() => {
    handleFetchBookings();
  }, [handleFetchBookings]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      CONFIRMED: 'bg-orange-200 text-orange-900 hover:bg-orange-300',
      IN_PROGRESS: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      CANCELLED: 'bg-red-100 text-red-800 hover:bg-red-200',
      COMPLETED: 'bg-green-100 text-green-800 hover:bg-green-200',
    };

    const statusLabels: Record<string, string> = {
      PENDING: 'Chờ duyệt',
      CONFIRMED: 'Đã xác nhận',
      IN_PROGRESS: 'Đang tiến hành',
      CANCELLED: 'Đã hủy',
      COMPLETED: 'Hoàn thành',
    };

    return (
      <Badge
        variant="secondary"
        className={variants[status] || 'bg-gray-100 text-gray-800'}
      >
        {statusLabels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <History className="h-6 w-6" />
            Lịch sử đặt lịch
          </h2>
          <p className="text-slate-600 mt-1">
            Xem và quản lý lịch sử đặt chỗ của bạn
          </p>
        </div>
      </div>

      {bookings?.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-12">
            <History className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Chưa có lịch hẹn
            </h3>
            <p className="text-slate-600 text-center">
              Lịch sử đặt chỗ của bạn sẽ xuất hiện ở đây sau khi bạn thực hiện
              đặt chỗ đầu tiên.
            </p>
            <Button
              onClick={handleNavigateToBookingPage}
              variant={'default'}
              className="mt-4"
            >
              Đặt lịch ngay
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings?.map((event: Event) => (
            <Card
              key={event.event_id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-slate-900">
                        {event.event_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.room?.room_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.event_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">
                        {formatCurrency(
                          event.final_cost?.toString() ||
                            event.estimated_cost?.toString(),
                        )}
                      </div>
                      {getStatusBadge(event.status)}
                    </div>
                    <Button
                      onClick={() => handleViewDetail(event)}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Xem
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default BookingHistoryTab;
