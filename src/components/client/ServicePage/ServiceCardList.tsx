import type { Service } from '@/services/serviceService';
import React, { useState, useEffect } from 'react';

// interface ServiceImage {
//   image_id: number;
//   image_url: string;
//   alt_text: string | null;
// }

interface ServiceCardProps {
  service: Service;
  onViewDetail?: (service: Service) => void;
  onSelect?: (service: Service) => void;
  chosen?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onViewDetail,
  onSelect,
  chosen,
}) => {
  const handleCardClick = () => {
    if (onSelect) {
      onSelect(service);
    } else if (onViewDetail) {
      onViewDetail(service);
    }
  };

  const isSelectableCard = React.useMemo(() => Boolean(onSelect), [onSelect]);

  const imageUrl =
    service.images?.[0]?.image_url ||
    'https://www.pngkey.com/png/full/233-2332677_generic-placeholder-image-conference-room-free-icon.png';

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 relative"
      onClick={handleCardClick}
    >
      {isSelectableCard && (
        <div
          className={`absolute top-3 right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
            chosen
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-gray-300 text-gray-400'
          }`}
        >
          {chosen ? '✓' : ''}
        </div>
      )}

      <img
        src={imageUrl}
        alt={service.service_name}
        className="w-full h-48 object-cover rounded-t-lg"
        loading="lazy"
      />

      <div className="p-6">
        <div className="flex justify-start items-start gap-4 mb-3">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
            {service.service_name}
          </h3>
          <div className="flex gap-2 ml-4">
            {service.is_available && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Available
              </span>
            )}
            {!service.is_active && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                Inactive
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
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
            <span>Setup: {service.setup_time} phút</span>
          </div>

          <button
            className={`${
              chosen
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            } px-4 py-1 rounded-lg font-medium transition-colors duration-200`}
            onClick={(e) => {
              e.stopPropagation();

              if (isSelectableCard) {
                onSelect?.(service);
              } else {
                onViewDetail?.(service);
              }
            }}
          >
            {isSelectableCard
              ? chosen
                ? 'Selected'
                : 'Select'
              : 'Xem chi tiết'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ServiceCardListProps {
  services?: Service[];
  loading?: boolean;
  onViewDetail?: (service: Service) => void;
  onSelect?: (service: Service[]) => void;
  className?: string;
}

const ServiceCardList: React.FC<ServiceCardListProps> = ({
  services = [],
  loading = false,
  onViewDetail,
  onSelect,
  className = '',
}) => {
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [chosenServices, setChosenServices] = useState<Service[]>([]);

  useEffect(() => {
    console.log(services);
    const activeServices = services.filter(
      (service) => service.is_active && service.is_available,
    );
    console.log(activeServices);
    setFilteredServices(activeServices);
  }, [services]);

  const handleSelect = (service: Service) => {
    setChosenServices((prev) => {
      const exists = prev.some((s) => s.service_id === service.service_id);
      const updated = exists
        ? prev.filter((s) => s.service_id !== service.service_id)
        : [...prev, service];
      onSelect?.(updated);
      return updated;
    });
  };

  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      >
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md border border-gray-200 animate-pulse"
          >
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredServices.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 mb-4">
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Services Available
        </h3>
        <p className="text-gray-500">
          There are currently no services available for booking.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {filteredServices.map((service) => (
        <ServiceCard
          key={service.service_id}
          service={service}
          onViewDetail={onViewDetail}
          onSelect={onSelect ? () => handleSelect(service) : undefined}
          chosen={chosenServices.some(
            (s) => s.service_id === service.service_id,
          )}
        />
      ))}
    </div>
  );
};

export default ServiceCardList;
