import type React from 'react';
import { useState } from 'react';
import {
  X,
  Clock,
  Tag,
  Eye,
  EyeOff,
  Calendar,
  CheckCircle,
  Package,
} from 'lucide-react';
import type { Service } from '@/services/serviceService';

interface ServiceDetailProps {
  service: Service;
  onClose: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const images = Array.isArray(service.images) ? service.images : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Chi tiết dịch vụ
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              ID: #{service.service_id}
            </p>
          </div>
          <button
            className="p-2 hover:bg-white/80 rounded-full transition-colors group"
            onClick={onClose}
            title="Đóng"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            {/* Service Name and Status */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                  {service.service_name}
                </h3>
                <div className="flex gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      service.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {service.is_active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                    {service.is_active ? 'Hoạt động' : 'Ẩn'}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      service.is_available
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {service.is_available ? 'Có sẵn' : 'Không có sẵn'}
                  </span>
                </div>
              </div>

              {service.description && (
                <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 p-4 rounded-xl">
                  {service.description}
                </p>
              )}
            </div>

            {/* Service Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">
                    Thời gian chuẩn bị
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-800">
                  {service.setup_time || 0}{' '}
                  <span className="text-sm font-normal">phút</span>
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <Tag className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">
                    Loại dịch vụ
                  </span>
                </div>
                <p className="text-lg font-medium text-purple-800">
                  {service.service_type?.service_type_name ||
                    `ID: ${service.service_type_id}`}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">
                    Cập nhật lần cuối
                  </span>
                </div>
                <p className="text-sm font-medium text-green-800">
                  {service.updated_at
                    ? new Date(service.updated_at).toLocaleDateString('vi-VN')
                    : 'Chưa có'}
                </p>
              </div>
            </div>

            {/* Images Section */}
            {images.length > 0 ? (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  Hình ảnh dịch vụ
                </h4>

                {/* Main Image */}
                <div className="mb-4">
                  <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video max-w-2xl mx-auto shadow-lg">
                    <img
                      src={
                        images[selectedImageIndex]?.image_url ||
                        '/placeholder.svg'
                      }
                      alt={
                        images[selectedImageIndex]?.alt_text ||
                        `Service image ${selectedImageIndex + 1}`
                      }
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </div>
                </div>

                {/* Image Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-3 justify-center flex-wrap">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                          selectedImageIndex === idx
                            ? 'border-blue-500 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ width: 80, height: 60 }}
                      >
                        <img
                          src={img.image_url || '/placeholder.svg'}
                          alt={img.alt_text || `Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {selectedImageIndex === idx && (
                          <div className="absolute inset-0 bg-blue-500/20"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-8 text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="text-gray-400 mb-2">
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">
                  Không có hình ảnh cho dịch vụ này
                </p>
              </div>
            )}

            <div className="mb-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                Biến thể và Giá cả
              </h4>

              {service.variations && service.variations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {service.variations.map((variation, index) => (
                    <div
                      key={variation.variation_id}
                      className="bg-white border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-blue-600" />
                          <h5 className="text-lg font-bold text-gray-900">
                            {variation.variation_name}
                          </h5>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          ID: {variation.variation_id}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-blue-600">
                            {new Intl.NumberFormat('vi-VN').format(
                              Number.parseInt(variation.base_price),
                            )}
                          </span>
                          <span className="text-gray-500 text-sm">VNĐ</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          Giá cơ bản cho biến thể này
                        </p>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700">
                            Dịch vụ chất lượng cao
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700">
                            Hỗ trợ chuyên nghiệp
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700">
                            Đảm bảo chất lượng
                          </span>
                        </div>
                      </div>

                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors">
                        Chọn biến thể này
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    Chưa có biến thể nào cho dịch vụ này
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Các biến thể và giá cả sẽ được hiển thị khi có sẵn
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div>
                    <h6 className="font-semibold text-blue-900 mb-1">
                      Thông tin thêm
                    </h6>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      Tất cả các biến thể đều bao gồm vận chuyển miễn phí trong
                      nội thành. Giá có thể thay đổi tùy theo yêu cầu cụ thể và
                      thời gian tổ chức sự kiện.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex justify-end">
            <button
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
