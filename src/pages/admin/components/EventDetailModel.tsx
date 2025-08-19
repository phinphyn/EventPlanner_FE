'use client';

import * as React from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Event } from '@/services/eventService';

export interface EventStatusUpdate {
  eventId: string | number;
  status: Event['status'];
}

interface EventDetailModalProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (update: EventStatusUpdate) => void;
  onConfirmEvent: (eventId: string | number) => void;
}

const getStatusBadge = (status: string) => {
  console.log(status);

  const variants: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    CONFIRMED: 'bg-green-100 text-green-800 hover:bg-green-200',
    CANCELLED: 'bg-red-100 text-red-800 hover:bg-red-200',
    COMPLETED: 'bg-green-100 text-green-800 hover:bg-green-200',
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Chờ duyệt',
    IN_PROGRESS: 'Đang tiến hành',
    CONFIRMED: 'Đã xác nhận',
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

export function EventDetailModal({
  event,
  open,
  onOpenChange,
  onStatusUpdate,
  onConfirmEvent,
}: EventDetailModalProps) {
  const [newStatus, setNewStatus] = React.useState<string>('');
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    if (event) {
      setNewStatus(event.status);
    }
  }, [event]);

  if (!event) return null;

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === event.status) return;

    setIsUpdating(true);

    try {
      console.log(newStatus);
      await onStatusUpdate({ eventId: event.event_id, status: newStatus });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update event status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmEvent = async () => {
    setIsUpdating(true);
    try {
      await onConfirmEvent(event.event_id);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to confirm event:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const estimatedCost = Number.parseInt(event.estimated_cost) || 0;
  const roomServiceFee = event.room_service_fee
    ? Number.parseInt(event.room_service_fee)
    : 0;
  const finalCost = event.final_cost ? Number.parseInt(event.final_cost) : null;
  const totalEstimated = estimatedCost + roomServiceFee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold">
                {event.event_name}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge(event.status)}
                <span className="text-sm text-muted-foreground">
                  ID: {event.event_id}
                </span>
              </div>
            </div>
          </div>
          <DialogDescription className="text-base">
            {event.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Ngày & Thời gian</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(event.event_date)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.start_time} - {event.end_time}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phòng</p>
                  <p className="text-sm text-muted-foreground">
                    {event.room?.room_name || 'Chưa xác định'}
                  </p>
                  {event.room?.guest_capacity && (
                    <p className="text-xs text-muted-foreground">
                      Sức chứa: {event.room.guest_capacity} người
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Người tổ chức</p>
                  <p className="text-sm text-muted-foreground">
                    {event.account?.account_name || 'Chưa xác định'}
                  </p>
                  {event.account?.email && (
                    <p className="text-xs text-muted-foreground">
                      {event.account.email}
                    </p>
                  )}
                  {event.account?.phone && (
                    <p className="text-xs text-muted-foreground">
                      {event.account.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <p className="font-medium">Chi phí Sự kiện</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Chi phí ước tính:</span>
                    <span>{estimatedCost.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  {roomServiceFee > 0 && (
                    <div className="flex justify-between">
                      <span>Phí dịch vụ phòng:</span>
                      <span>{roomServiceFee.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>
                      {finalCost ? 'Chi phí cuối cùng:' : 'Tổng ước tính:'}
                    </span>
                    <span>
                      {finalCost
                        ? finalCost.toLocaleString('vi-VN')
                        : totalEstimated.toLocaleString('vi-VN')}{' '}
                      ₫
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Loại sự kiện</p>
                  <p className="text-sm text-muted-foreground">
                    {event.event_type?.type_name || 'Chưa xác định'}
                  </p>
                </div>
              </div>

              {/* {event.eventServicesCount && (
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Dịch vụ đi kèm</p>
                    <p className="text-sm text-muted-foreground">
                      {event.eventServicesCount} dịch vụ
                    </p>
                  </div>
                </div>
              )} */}

              {event.date_create && (
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Ngày tạo</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(event.date_create)}
                    </p>
                  </div>
                </div>
              )}

              {event.updated_at && (
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Cập nhật lần cuối</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(event.updated_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Status Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quản lý Trạng thái</h3>

            {event.status === 'PENDING' ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sự kiện này đang chờ phê duyệt. Bạn có thể xác nhận để đưa vào
                  hoạt động.
                </p>
                <Button
                  onClick={handleConfirmEvent}
                  disabled={isUpdating}
                  className="w-full"
                >
                  {isUpdating ? 'Đang xác nhận...' : 'Xác nhận Sự kiện'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Thay đổi Trạng thái</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái mới" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                      <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                      <SelectItem value="IN_PROGRESS">
                        Đang tiến hành
                      </SelectItem>
                      <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                      <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={
                      isUpdating || !newStatus || newStatus === event.status
                    }
                    className="flex-1"
                  >
                    {isUpdating ? 'Đang cập nhật...' : 'Cập nhật Trạng thái'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
