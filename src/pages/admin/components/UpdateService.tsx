import type React from 'react';
import { useState, useEffect } from 'react';
import { X, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import type { Service } from '@/services/serviceService';
import serviceService from '@/services/serviceService';

interface UpdateServiceProps {
  service: Service;
  onClose: () => void;
  onSuccess: () => void;
}

const UpdateService: React.FC<UpdateServiceProps> = ({
  service,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<Service>>({ ...service });
  const [formImages, setFormImages] = useState<File[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  useEffect(() => {
    if (formImages.length > 0) {
      const previews = formImages.map((file) => URL.createObjectURL(file));
      setImagePreview(previews);

      // Cleanup URLs when component unmounts or images change
      return () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      setImagePreview([]);
    }
  }, [formImages]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    let checked = false;
    if (type === 'checkbox' && 'checked' in e.target) {
      checked = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Validate file types and sizes
      const validFiles = files.filter((file) => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

        if (!isValidType) {
          setError(`File ${file.name} không phải là hình ảnh hợp lệ`);
          return false;
        }
        if (!isValidSize) {
          setError(`File ${file.name} quá lớn (tối đa 5MB)`);
          return false;
        }
        return true;
      });

      setFormImages(validFiles);
      setError('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = formImages.filter((_, i) => i !== index);
    setFormImages(newImages);
  };

  const validateForm = (): boolean => {
    if (!formData.service_name?.trim()) {
      setError('Tên dịch vụ không được để trống');
      return false;
    }
    if (formData.setup_time && formData.setup_time < 0) {
      setError('Thời gian chuẩn bị không được âm');
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormLoading(true);
    setError('');
    setSuccess('');

    try {
      const form = new FormData();

      // Append form data
      const excludeKeys = [
        'service_id',
        'updated_at',
        'images',
        'service_type',
      ];
      Object.entries(formData).forEach(([key, value]) => {
        if (
          !excludeKeys.includes(key) &&
          value !== undefined &&
          value !== null
        ) {
          form.append(key, String(value));
        }
      });

      // Append images
      formImages.forEach((file) => {
        form.append('images', file);
      });

      await serviceService.updateService(Number(service.service_id), form);

      setSuccess('Cập nhật dịch vụ thành công!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi cập nhật dịch vụ');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Cập nhật dịch vụ
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

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
            {/* Alert Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* Service Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên dịch vụ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="service_name"
                value={formData.service_name || ''}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
                placeholder="Nhập tên dịch vụ"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleFormChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Nhập mô tả dịch vụ"
              />
            </div>

            {/* Setup Time and Service Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thời gian chuẩn bị (phút)
                </label>
                <input
                  type="number"
                  name="setup_time"
                  value={formData.setup_time || 0}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  min={0}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loại dịch vụ
                </label>
                <input
                  type="text"
                  value={
                    service.service_type?.service_type_name ||
                    `ID: ${service.service_type_id}`
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                  disabled
                  placeholder="Loại dịch vụ"
                />
              </div>
            </div>

            {/* Status Checkboxes */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Trạng thái
              </h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={!!formData.is_available}
                    onChange={handleFormChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Có sẵn
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={!!formData.is_active}
                    onChange={handleFormChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Hoạt động
                  </span>
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hình ảnh dịch vụ
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Chọn hình ảnh</p>
                  <p className="text-gray-400 text-sm mt-1">
                    PNG, JPG, GIF tối đa 5MB mỗi file
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreview.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Hình ảnh đã chọn:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview || '/placeholder.svg'}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Images */}
              {service.images && service.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Hình ảnh hiện tại:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {service.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img.image_url || '/placeholder.svg'}
                          alt={img.alt_text || `Current image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl font-medium transition-colors"
              onClick={onClose}
              disabled={formLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleFormSubmit}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={formLoading}
            >
              {formLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateService;
