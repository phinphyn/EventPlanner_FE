import React from 'react';
import { useParams } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon as PendingIcon,
} from '@heroicons/react/24/outline';

import type { Event } from '@/services/eventService';
import eventService from '@/services/eventService';

const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const [event, setEvent] = React.useState<Event>();

  React.useEffect(() => {
    const fetchEvent = async () => {
      const response = await eventService.getEventById(
        eventId?.toString() || '',
      );

      console.log(response.data);
      setEvent(response.data);
    };
    fetchEvent();
  }, [eventId]);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(parseInt(amount));
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: PendingIcon,
        label: 'Đang chờ',
      },
      CONFIRMED: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircleIcon,
        label: 'Đã xác nhận',
      },
      CANCELLED: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: ExclamationTriangleIcon,
        label: 'Đã hủy',
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        <IconComponent className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    );
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {event.event_name}
                </h1>
                <p className="text-primary-100 text-lg">Chi tiết sự kiện</p>
              </div>
              <div className="text-right">{getStatusBadge(event.status)}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="w-6 h-6 mr-2 text-primary" />
                Thông tin sự kiện
              </h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <UserIcon className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Mã tài khoản
                    </p>
                    <p className="text-gray-900">#{event.account_id}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <DocumentTextIcon className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mô tả</p>
                    <p className="text-gray-900">{event.description}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phòng</p>
                    <p className="text-gray-900">Phòng #{event.room_id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CalendarIcon className="w-6 h-6 mr-2 text-primary" />
                Thời gian tổ chức
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      Ngày sự kiện
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-blue-900">
                    {formatDate(event.event_date)}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ClockIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      Thời gian
                    </span>
                  </div>
                  <p className="text-sm text-green-900">
                    <span className="font-semibold">Bắt đầu:</span>{' '}
                    {formatDateTime(event.start_time)}
                  </p>
                  <p className="text-sm text-green-900">
                    <span className="font-semibold">Kết thúc:</span>{' '}
                    {formatDateTime(event.end_time)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Cost & Summary */}
          <div className="space-y-6">
            {/* Cost Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CurrencyDollarIcon className="w-6 h-6 mr-2 text-primary" />
                Chi phí
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Chi phí ước tính:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(event.estimated_cost)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Phí dịch vụ phòng:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(event.room_service_fee)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 bg-primary-50 rounded-lg px-4">
                  <span className="text-lg font-semibold text-primary">
                    Tổng chi phí:
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(event.final_cost)}
                  </span>
                </div>
              </div>
            </div>

            {/* Event Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Tóm tắt
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã sự kiện:</span>
                  <span className="font-medium">#{event.event_id}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Loại sự kiện:</span>
                  <span className="font-medium">#{event.event_type_id}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Số dịch vụ:</span>
                  <span className="font-medium">
                    {event.eventServicesCount}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-medium text-sm">
                    {formatDate(event.date_create)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Cập nhật lần cuối:</span>
                  <span className="font-medium text-sm">
                    {formatDate(event.updated_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-3">
                <button className="w-full bg-primary hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200">
                  Chỉnh sửa sự kiện
                </button>
                <button className="w-full bg-secondary hover:bg-secondary-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200">
                  Xem dịch vụ
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200">
                  In chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
