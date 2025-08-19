import type React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  FileText,
  Settings,
  Tag,
} from 'lucide-react';
import type { Event } from '@/services/eventService';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate, formatTime } from '@/utils/format';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  if (!event) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-bold">{event.event_name}</span>
            {getStatusBadge(event.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Thông tin sự kiện
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Ngày tổ chức</p>
                    <p className="font-medium">
                      {formatDate(event.event_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Thời gian</p>
                    <p className="font-medium">
                      {formatTime(event.start_time)} -{' '}
                      {formatTime(event.end_time)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Phòng</p>
                    <p className="font-medium">
                      {event.room?.room_name || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Loại sự kiện</p>
                    <p className="font-medium">
                      {event.event_type?.type_name || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {event.description && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Mô tả</p>
                    <p className="text-slate-900">{event.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          {event.account && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Tên khách hàng</p>
                    <p className="font-medium">
                      {event.account.account_name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-medium">
                      {event.account.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Số điện thoại</p>
                    <p className="font-medium">
                      {event.account.phone || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Services */}
          {event.event_services && event.event_services.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Dịch vụ đã chọn (
                  {event.eventServicesCount || event.event_services.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.event_services.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {service.service?.service_name || 'N/A'}
                        </p>
                        <p className="text-sm text-slate-600">
                          Số lượng: {event.eventServicesCount || 1}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(
                            service.variation.base_price?.toString() || '0',
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Chi phí
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Chi phí ước tính</span>
                <span className="font-medium">
                  {formatCurrency(event.estimated_cost?.toString() || '0')}
                </span>
              </div>

              {event.room_service_fee && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Phí dịch vụ phòng</span>
                  <span className="font-medium">
                    {formatCurrency(event.room_service_fee.toString())}
                  </span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng chi phí</span>
                <span className="text-green-600">
                  {formatCurrency(
                    event.final_cost?.toString() ||
                      event.estimated_cost?.toString() ||
                      '0',
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                {event.date_create && (
                  <div>
                    <span className="font-medium">Ngày tạo: </span>
                    {new Date(event.date_create).toLocaleString('vi-VN')}
                  </div>
                )}
                {event.updated_at && (
                  <div>
                    <span className="font-medium">Cập nhật lần cuối: </span>
                    {new Date(event.updated_at).toLocaleString('vi-VN')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailModal;
