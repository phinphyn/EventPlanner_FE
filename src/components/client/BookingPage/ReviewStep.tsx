import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Package,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Star,
  Timer,
} from 'lucide-react';

import type { Event } from '@/services/eventService';
import { formatDate, formatPrice, formatTime } from '@/utils/format';

interface ReviewStepProps {
  loading?: boolean;
  eventData?: Event | null;
  onReset?: () => void;
  onConfirm?: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  loading = false,
  eventData,
  onReset,
  onConfirm,
}) => {
  const data = eventData;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        label: 'Chờ xác nhận',
        variant: 'information' as const,
        icon: AlertCircle,
      },
      CONFIRMED: {
        label: 'Đã xác nhận',
        variant: 'default' as const,
        icon: CheckCircle,
      },
      COMPLETED: {
        label: 'Hoàn thành',
        variant: 'default' as const,
        icon: CheckCircle,
      },
      CANCELLED: {
        label: 'Đã hủy',
        variant: 'destructive' as const,
        icon: AlertCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const estimatedTotal = Number.parseInt(data?.estimated_cost || '');

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-3xl text-primary">
          Đang tạo sự kiện của bạn, vui lòng chờ...
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Xem lại thông tin sự kiện
        </h1>
        <p className="text-gray-600">
          Vui lòng kiểm tra lại thông tin và thanh toán phí đặt cọc để hoàn tất!
        </p>
      </div>

      {/* Event Overview Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl text-gray-900">
                {data?.event_name}
              </CardTitle>
              <p className="text-gray-600">{data?.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(data?.status || '')}
              {/* <Button onClick={onEdit} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button> */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Date */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tổ chức</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(data?.event_date || '')}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="font-semibold text-gray-900">
                  {formatTime(data?.start_time || '')} -{' '}
                  {formatTime(data?.end_time || '')}
                </p>
              </div>
            </div>

            {/* Room */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phòng</p>
                <p className="font-semibold text-gray-900">
                  {data?.room?.room_name}
                </p>
              </div>
            </div>

            {/* Event Type */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Loại sự kiện</p>
                <p className="font-semibold text-gray-900">
                  {data?.event_type?.type_name}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Thông tin người đặt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 justify-center">
              {data?.account?.avatar_url ? (
                <img
                  src={data?.account?.avatar_url || '/placeholder.svg'}
                  alt={data?.account?.account_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {data?.account?.account_name}
                </h3>
                <p className="text-sm text-gray-500">
                  ID: {data?.account?.account_id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-900">
                  {data?.account?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-100 rounded">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Số điện thoại</p>
                <p className="font-medium text-gray-900">
                  {data?.account?.phone}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Dịch vụ đã chọn
            <Badge variant="secondary">{data?.eventServicesCount}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data?.event_services ? (
            data?.event_services.map((eventService, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {eventService.service.service_name}
                        </h4>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="text-primary font-medium">
                          {eventService.variation.variation_name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {eventService.service.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Timer className="w-4 h-4" />
                          <span>
                            {eventService.variation.duration_hours} giờ
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Package className="w-4 h-4" />
                          <span>
                            Gói: {eventService.variation.variation_name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(eventService.variation.base_price)}
                      </p>
                      <p className="text-sm text-gray-500">Giá gói</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              Không có dịch vụ nào được chọn
            </p>
          )}
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Tổng kết chi phí
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng chi phí dịch vụ</span>
              <span className="font-semibold">
                {formatPrice(estimatedTotal.toString())}
              </span>
            </div>

            {/* {roomServiceFee > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phí phòng</span>
                <span className="font-semibold">
                  {formatPrice(data?.room_service_fee!)}
                </span>
              </div>
            )} */}

            <Separator />

            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold text-gray-900">
                Tổng chi phí ước tính
              </span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(data?.estimated_cost || '')}
              </span>
            </div>

            {/* {data?.final_cost && (
              <>
                <Separator />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-900">
                    Tổng cuối cùng
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(data?.final_cost)}
                  </span>
                </div>
              </>
            )} */}
          </div>
        </CardContent>
      </Card>

      {/* Event Timeline */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Thời gian tạo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-semibold">
                {formatDateTime(data?.date_create)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
              <p className="font-semibold">{formatDateTime(data?.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button
          onClick={onReset}
          variant="default"
          size="lg"
          className="px-16 bg-red-500 hover:bg-red-600 text-white"
        >
          Hủy đặt lịch
        </Button>
        <Button onClick={onConfirm} size="lg" className="min-w-32">
          <CheckCircle className="w-5 h-5 mr-2" />
          Xác nhận và Thanh toán
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
