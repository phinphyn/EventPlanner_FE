import React, { useState } from 'react';
import serviceTypeService from '@/services/serviceTypeService';
import type { ServiceType } from '../ServiceTypeListAdmin';

interface CreateServiceTypeProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateServiceType: React.FC<CreateServiceTypeProps> = ({
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<ServiceType>>({
    service_type_name: '',
    category: '',
    description: '',
    is_active: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{
    service_type_name?: string;
    category?: string;
  }>({});

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
  };

  const validate = () => {
    const errors: { service_type_name?: string; category?: string } = {};
    if (
      !formData.service_type_name ||
      formData.service_type_name.trim().length < 2 ||
      formData.service_type_name.trim().length > 255
    ) {
      errors.service_type_name = 'Tên loại dịch vụ phải từ 2 đến 255 ký tự';
    }
    if (
      formData.category &&
      (formData.category.trim().length < 2 ||
        formData.category.trim().length > 255)
    ) {
      errors.category = 'Danh mục phải từ 2 đến 255 ký tự';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    setFormLoading(true);
    try {
      await serviceTypeService.createServiceType(formData);
      onSuccess();
      onClose();
    } catch {
      setFormError('Lưu loại dịch vụ thất bại');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in border border-gray-200">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
          onClick={onClose}
          title="Đóng"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="text-red-500 text-sm mb-2">{formError}</div>
          )}
          <h2
            className="text-lg font-bold mb-2"
            style={{ color: 'var(--primary)' }}
          >
            Thêm loại dịch vụ
          </h2>
          <div>
            <label className="block mb-1 font-semibold">Tên loại dịch vụ</label>
            <input
              type="text"
              name="service_type_name"
              value={formData.service_type_name || ''}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            {fieldErrors.service_type_name && (
              <div className="text-red-500 text-sm mt-1">
                {fieldErrors.service_type_name}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Danh mục</label>
            <input
              type="text"
              name="category"
              value={formData.category || ''}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2"
            />
            {fieldErrors.category && (
              <div className="text-red-500 text-sm mt-1">
                {fieldErrors.category}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Mô tả</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={!!formData.is_active}
              onChange={handleFormChange}
            />
            <label>Hoạt động</label>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-white"
              disabled={formLoading}
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServiceType;
