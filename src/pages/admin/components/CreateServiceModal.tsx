import type React from 'react';
import { useState, useEffect } from 'react';
import {
  X,
  Upload,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Plus,
  Trash2,
  Package,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import serviceService from '@/services/serviceService';
import serviceTypeService, {
  type ServiceType,
} from '@/services/serviceTypeService';
import variationService from '@/services/variationService';

interface CreateServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Variation {
  variation_name: string;
  base_price: number;
  duration_hours: number | null;
  is_active: boolean;
  image?: File | null;
}

const CreateServiceModal: React.FC<CreateServiceModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    service_name: '',
    description: '',
    setup_time: 0,
    service_type_id: '',
    is_available: true,
    is_active: true,
  });
  const [formImages, setFormImages] = useState<File[]>([]);
  const [variations, setVariations] = useState<Variation[]>([
    {
      variation_name: '',
      base_price: 0,
      duration_hours: null,
      is_active: true,
      image: null,
    },
  ]);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loadingServiceTypes, setLoadingServiceTypes] = useState(false);
  const [currentStep, setCurrentStep] = useState<'service' | 'variations'>(
    'service',
  );
  const [createdServiceId, setCreatedServiceId] = useState<number | null>(null);
  const [createdServiceName, setCreatedServiceName] = useState<string>('');

  useEffect(() => {
    if (open) {
      loadServiceTypes();
      setCurrentStep('service');
      setCreatedServiceId(null);
      setCreatedServiceName('');
    }
  }, [open]);

  const loadServiceTypes = async () => {
    try {
      setLoadingServiceTypes(true);
      const response = await serviceTypeService.getAllServiceTypes();
      setServiceTypes(response.data.serviceTypes);
    } catch (err) {
      console.error('Error loading service types:', err);
      setError('Không thể tải danh sách loại dịch vụ');
    } finally {
      setLoadingServiceTypes(false);
    }
  };

  if (!open) return null;

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

    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleServiceTypeSelect = (serviceTypeId: string) => {
    setFormData((prev) => ({
      ...prev,
      service_type_id: serviceTypeId,
    }));
    setIsDropdownOpen(false);
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const validFiles = files.filter((file) => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024;

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

  const addVariation = () => {
    setVariations([
      ...variations,
      {
        variation_name: '',
        base_price: 0,
        duration_hours: null,
        is_active: true,
        image: null,
      },
    ]);
  };

  const removeVariation = (index: number) => {
    if (variations.length > 1) {
      setVariations(variations.filter((_, i) => i !== index));
    }
  };

  const updateVariation = (
    index: number,
    field: keyof Variation,
    value: any,
  ) => {
    const updatedVariations = [...variations];
    updatedVariations[index] = { ...updatedVariations[index], [field]: value };
    setVariations(updatedVariations);
  };

  const handleVariationImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        setError(`File ${file.name} không phải là hình ảnh hợp lệ`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} quá lớn (tối đa 5MB)`);
        return;
      }

      updateVariation(index, 'image', file);
      setError('');
    }
  };

  const validateServiceForm = (): boolean => {
    if (!formData.service_name.trim()) {
      setError('Tên dịch vụ không được để trống');
      return false;
    }
    if (!formData.service_type_id) {
      setError('Vui lòng chọn loại dịch vụ');
      return false;
    }
    if (formData.setup_time < 0) {
      setError('Thời gian chuẩn bị không được âm');
      return false;
    }
    return true;
  };

  const validateVariations = (): boolean => {
    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i];
      if (!variation.variation_name.trim()) {
        setError(`Tên biến thể ${i + 1} không được để trống`);
        return false;
      }
      if (variation.base_price <= 0) {
        setError(`Giá cơ bản của biến thể ${i + 1} phải lớn hơn 0`);
        return false;
      }
      if (variation.duration_hours !== null && variation.duration_hours < 0) {
        setError(`Thời gian của biến thể ${i + 1} không được âm`);
        return false;
      }
    }
    return true;
  };

  const handleCreateService = async () => {
    if (!validateServiceForm()) return;

    setFormLoading(true);
    setError('');
    setSuccess('');

    try {
      const serviceForm = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        serviceForm.append(key, String(value));
      });

      formImages.forEach((file) => {
        serviceForm.append('images', file);
      });

      const serviceResponse = await serviceService.createService(serviceForm);
      const serviceId = serviceResponse.data.service_id;

      setCreatedServiceId(serviceId);
      setCreatedServiceName(formData.service_name);
      setSuccess('Tạo dịch vụ thành công! Bây giờ bạn có thể thêm biến thể.');
      setCurrentStep('variations');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi tạo dịch vụ');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateVariations = async () => {
    if (!validateVariations()) return;
    if (!createdServiceId) {
      setError('Không tìm thấy ID dịch vụ');
      return;
    }

    setFormLoading(true);
    setError('');
    setSuccess('');

    try {
      for (const variation of variations) {
        const variationForm = new FormData();
        variationForm.append('service_id', createdServiceId.toString());
        variationForm.append('variation_name', variation.variation_name.trim());
        variationForm.append('base_price', variation.base_price.toString());
        if (variation.duration_hours !== null) {
          variationForm.append(
            'duration_hours',
            variation.duration_hours.toString(),
          );
        }
        variationForm.append('is_active', variation.is_active.toString());

        if (variation.image) {
          variationForm.append('image', variation.image);
        }

        await variationService.createVariation(variationForm);
      }

      setSuccess('Tạo biến thể thành công!');
      setTimeout(() => {
        onSuccess();
        onClose();
        setFormData({
          service_name: '',
          description: '',
          setup_time: 0,
          service_type_id: '',
          is_available: true,
          is_active: true,
        });
        setFormImages([]);
        setVariations([
          {
            variation_name: '',
            base_price: 0,
            duration_hours: null,
            is_active: true,
            image: null,
          },
        ]);
        setCurrentStep('service');
        setCreatedServiceId(null);
        setCreatedServiceName('');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi tạo biến thể');
    } finally {
      setFormLoading(false);
    }
  };

  const validateForm = (): boolean => {
    return validateServiceForm() && validateVariations();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 'service') {
      await handleCreateService();
    } else {
      await handleCreateVariations();
    }
  };

  const getSelectedServiceTypeName = () => {
    const selectedType = serviceTypes.find(
      (type) => type.service_type_id.toString() === formData.service_type_id,
    );
    return selectedType ? selectedType.service_type_name : 'Chọn loại dịch vụ';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-scroll">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentStep === 'service'
                ? 'Tạo dịch vụ mới'
                : `Thêm biến thể cho "${createdServiceName}"`}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {currentStep === 'service'
                ? 'Bước 1: Tạo thông tin dịch vụ cơ bản'
                : 'Bước 2: Thêm các biến thể cho dịch vụ'}
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

            {currentStep === 'service' && (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Thông tin dịch vụ
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="service_name"
                      value={formData.service_name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      required
                      placeholder="Nhập tên dịch vụ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Nhập mô tả dịch vụ"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Thời gian chuẩn bị (phút)
                      </label>
                      <input
                        type="number"
                        name="setup_time"
                        value={formData.setup_time}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        min={0}
                        placeholder="0"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Loại dịch vụ <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-left bg-white flex items-center justify-between"
                          disabled={loadingServiceTypes}
                        >
                          <span
                            className={
                              formData.service_type_id
                                ? 'text-gray-900'
                                : 'text-gray-500'
                            }
                          >
                            {loadingServiceTypes
                              ? 'Đang tải...'
                              : getSelectedServiceTypeName()}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              isDropdownOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isDropdownOpen && !loadingServiceTypes && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                            {serviceTypes.map((serviceType) => (
                              <button
                                key={serviceType.service_type_id}
                                type="button"
                                onClick={() =>
                                  handleServiceTypeSelect(
                                    serviceType.service_type_id.toString(),
                                  )
                                }
                                className={`w-full px-4 py-3 text-left hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                                  formData.service_type_id ===
                                  serviceType.service_type_id.toString()
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-900'
                                }`}
                              >
                                <div className="font-medium">
                                  {serviceType.service_type_name}
                                </div>
                                {/* <div className="text-sm text-gray-500">
                                  {serviceType.service_type_name || serviceType.category}
                                </div> */}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Trạng thái
                    </h4>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_available"
                          checked={formData.is_available}
                          onChange={handleFormChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Có sẵn
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={formData.is_active}
                          onChange={handleFormChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Hoạt động
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hình ảnh dịch vụ
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
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
                        <p className="text-gray-600 font-medium">
                          Chọn hình ảnh
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          PNG, JPG, GIF tối đa 5MB mỗi file
                        </p>
                      </label>
                    </div>

                    {formImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Hình ảnh đã chọn:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {formImages.map((file, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                            >
                              {file.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'variations' && (
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-purple-900 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Biến thể dịch vụ
                  </h3>
                  <button
                    type="button"
                    onClick={addVariation}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm biến thể
                  </button>
                </div>

                <div className="space-y-4">
                  {variations.map((variation, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-xl border border-purple-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">
                          Biến thể {index + 1}
                        </h4>
                        {variations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariation(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tên biến thể <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={variation.variation_name}
                            onChange={(e) =>
                              updateVariation(
                                index,
                                'variation_name',
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            placeholder="Ví dụ: Gói cơ bản, Gói cao cấp"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Giá cơ bản (VNĐ){' '}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={variation.base_price}
                            onChange={(e) =>
                              updateVariation(
                                index,
                                'base_price',
                                Number(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            min={0}
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Thời gian (giờ)
                          </label>
                          <input
                            type="number"
                            value={variation.duration_hours || ''}
                            onChange={(e) =>
                              updateVariation(
                                index,
                                'duration_hours',
                                e.target.value ? Number(e.target.value) : null,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            min={0}
                            placeholder="Để trống nếu không có"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Hình ảnh biến thể
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleVariationImageChange(index, e)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          />
                          {variation.image && (
                            <p className="text-sm text-green-600 mt-1">
                              ✓ {variation.image.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={variation.is_active}
                            onChange={(e) =>
                              updateVariation(
                                index,
                                'is_active',
                                e.target.checked,
                              )
                            }
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Biến thể hoạt động
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              {currentStep === 'variations' && (
                <button
                  type="button"
                  onClick={() => setCurrentStep('service')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl font-medium transition-colors flex items-center gap-2"
                  disabled={formLoading}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
              )}
            </div>

            <div className="flex gap-3">
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
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={formLoading}
              >
                {formLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {currentStep === 'service'
                      ? 'Đang tạo dịch vụ...'
                      : 'Đang tạo biến thể...'}
                  </>
                ) : (
                  <>
                    {currentStep === 'service' ? 'Tạo dịch vụ' : 'Tạo biến thể'}
                    {currentStep === 'service' && (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateServiceModal;
