import serviceService from '@/services/serviceService';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface ServiceType {
  service_type_id: number;
  service_type_name: string;
  description?: string;
}

interface Service {
  service_id: number;
  service_name: string;
  description: string;
  setup_time: number;
  is_available: boolean;
  is_active: boolean;
  updated_at: string;
  service_type_id: number;
  service_type?: ServiceType;
}

interface ServiceDetailPageProps {
  serviceId?: number;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceId: propServiceId,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const serviceId = propServiceId || (id ? parseInt(id) : null);

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails(serviceId);
    }
  }, [serviceId]);

  const fetchServiceDetails = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      // Replace with your actual API endpoint
      const response = await serviceService.getServiceById(id.toString());

      console.log(response);

      setService(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load service details',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = () => {
    if (!service?.is_available) {
      return;
    }
    setShowBookingModal(true);
    // Navigate to booking page or open booking modal
    // navigate(`/booking/service/${service.service_id}`)
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAvailabilityStatus = () => {
    if (!service?.is_active) {
      return {
        status: 'Inactive',
        color: 'bg-gray-100 text-gray-600',
        icon: '⏸️',
      };
    }

    if (service.is_available) {
      return {
        status: 'Available',
        color: 'bg-green-100 text-green-800',
        icon: '✅',
      };
    } else {
      return {
        status: 'Currently Booked',
        color: 'bg-red-100 text-red-800',
        icon: '📅',
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6 w-1/4"></div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-6 w-1/3"></div>
              <div className="space-y-3 mb-8">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Service Not Found
            </h3>
            <p className="text-gray-500 mb-6">
              {error || 'The requested service could not be found.'}
            </p>
            <button
              onClick={handleGoBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const availabilityInfo = getAvailabilityStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Quay lại
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {service.service_name}
                </h1>
                {service.service_type && (
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Danh mục: {service.service_type.service_type_name}
                  </div>
                )}
              </div>

              <div className="ml-6 text-right">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${availabilityInfo.color}`}
                >
                  <span className="mr-1">{availabilityInfo.icon}</span>
                  {availabilityInfo.status}
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-6">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Mô tả dịch vụ
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Service Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Setup Time */}
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-blue-600 mb-2">
                  <svg
                    className="w-8 h-8 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Thời gian setup
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {service.setup_time}
                </p>
                <p className="text-sm text-gray-600">phút</p>
              </div>

              {/* Availability Status */}
              <div
                className={`rounded-lg p-6 text-center ${
                  service.is_available ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div
                  className={`mb-2 ${
                    service.is_available ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <svg
                    className="w-8 h-8 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        service.is_available
                          ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                          : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                      }
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Trạng thái</h3>
                <p
                  className={`text-lg font-bold ${
                    service.is_available ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {service.is_available ? 'Sẵn sàng' : 'Đã đặt'}
                </p>
                <p className="text-sm text-gray-600">
                  {service.is_available
                    ? 'Sẵn sàng để đặt'
                    : 'Hiện tại không khả dụng'}
                </p>
              </div>

              {/* Last Updated */}
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-gray-600 mb-2">
                  <svg
                    className="w-8 h-8 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Cập nhật lần cuối
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDate(service.updated_at)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleBookService}
                disabled={!service.is_available || !service.is_active}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  service.is_available && service.is_active
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {service.is_available && service.is_active ? (
                  <>
                    <svg
                      className="w-5 h-5 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Tạo sự kiện với dịch vụ này
                  </>
                ) : (
                  'Dịch vụ không khả dụng'
                )}
              </button>

              <button
                onClick={() => navigate('/services')}
                className="flex-1 sm:flex-none py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
              >
                Xem thêm dịch vụ
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        {service.service_type?.description && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Về danh mục dịch vụ này
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {service.service_type.description}
            </p>
          </div>
        )}

        {/* Service Guidelines */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Hướng dẫn dịch vụ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Những gì bao gồm
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Thiết lập và thực hiện dịch vụ chuyên nghiệp
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {service.setup_time} phút thiết lập thời gian bao gồm
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Đảm bảo chất lượng và hỗ trợ
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Dọn dẹp sau dịch vụ (nếu có)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Lưu ý quan trọng
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Vui lòng đặt chỗ trước để đảm bảo có sẵn
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Thời gian thiết lập có thể thay đổi tùy theo yêu cầu cụ thể
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Chính sách hủy bỏ áp dụng theo điều khoản
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Liên hệ hỗ trợ cho các yêu cầu đặc biệt
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Cần giúp đỡ?
            </h2>
            <p className="text-gray-600 mb-6">
              Có câu hỏi về dịch vụ này? Đội ngũ của chúng tôi sẵn sàng giúp bạn
              đưa ra lựa chọn đúng đắn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm"
              >
                <svg
                  className="w-5 h-5 mr-2"
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
                Gọi điện ngay
              </a>
              <a
                href="mailto:support@webevent.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email cho chúng tôi
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-popover-foreground flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-green-600 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Đặt lịch ngay?
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn sắp đặt lịch cho dịch vụ "{service.service_name}". Điều này
                sẽ chuyển hướng bạn đến biểu mẫu đặt lịch.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    navigate(`/bookings?service=${service.service_id}`);
                  }}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailPage;
