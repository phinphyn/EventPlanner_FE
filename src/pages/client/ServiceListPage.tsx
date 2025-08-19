import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import ServiceCardList from '@/components/client/ServicePage/ServiceCardList';
import serviceService from '@/services/serviceService';

import type { Service } from '@/services/serviceService';
import { useNavigate } from 'react-router-dom';

const breadcrumbItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Dịch vụ', href: '/services' },
];

const ServiceListPage = () => {
  const navigate = useNavigate();
  const ref = React.useRef<HTMLDivElement>(null);

  const [loading, setLoading] = React.useState(false);
  const [services, setServices] = React.useState<Service[]>([]);

  const handleViewDetail = React.useCallback(
    (service: Service) => {
      navigate(`/services/${service.service_id}`);
    },
    [navigate],
  );

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await serviceService.getAllServices();
      console.log(response);
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }

    fetchServices();
  }, []);

  return (
    <div ref={ref} className="px-16 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={index}>
              {item.href === '/services' ? (
                <BreadcrumbPage>
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="container mx-auto py-8">
        <ServiceCardList
          services={services}
          loading={loading}
          onViewDetail={handleViewDetail}
          // onSelect={handleSelectService}
        />
      </div>
    </div>
  );
};

export default ServiceListPage;
