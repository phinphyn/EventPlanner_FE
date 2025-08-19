import React from 'react';
import type { ServiceType } from '../ServiceTypeListAdmin';

interface ServiceTypeDetailProps {
  serviceType: ServiceType;
  onClose: () => void;
}

const ServiceTypeDetail: React.FC<ServiceTypeDetailProps> = ({
  serviceType,
  onClose,
}) => {
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
        <h2
          className="text-2xl font-bold mb-4 text-center text-primary"
          style={{ color: 'var(--primary)' }}
        >
          Thông tin loại dịch vụ
        </h2>
        <div className="space-y-3 mb-6">
          <div>
            <span className="font-semibold">ID:</span>{' '}
            {serviceType.service_type_id}
          </div>
          <div>
            <span className="font-semibold">Tên loại dịch vụ:</span>{' '}
            {serviceType.service_type_name}
          </div>
          <div>
            <span className="font-semibold">Danh mục:</span>{' '}
            {serviceType.category}
          </div>
          <div>
            <span className="font-semibold">Mô tả:</span>{' '}
            {serviceType.description}
          </div>
          <div>
            <span className="font-semibold">Hoạt động:</span>{' '}
            {serviceType.is_active ? (
              <span className="text-green-600 font-bold">✔️</span>
            ) : (
              <span className="text-red-500 font-bold">❌</span>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 rounded bg-primary text-white hover:bg-secondary transition"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceTypeDetail;
