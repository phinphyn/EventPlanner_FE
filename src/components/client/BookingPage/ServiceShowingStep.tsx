import React from 'react';
import ServiceCardList from '../ServicePage/ServiceCardList';
import type { GetAllServiceQueries, Service } from '@/services/serviceService';
import serviceService from '@/services/serviceService';
import useStepForm from '@/hooks/useStepForm';

const ServiceShowingStep = () => {
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { updateField } = useStepForm();

  const onChooseService = (services: Service[]) => {
    console.log('Selected services:', services);

    updateField(
      'selected_services',
      services.map((service) => Number(service.service_id)),
    );
  };

  const fetchServices = React.useCallback(async () => {
    setLoading(true);
    try {
      const query: GetAllServiceQueries = {
        includeImages: true,
        includeVariations: true,
      };
      const response = await serviceService.getAllServices(query);

      const filteredServices = response.data.services.filter(
        (service) => service.variationCount !== 0,
      );

      setServices(filteredServices);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <div>
      <h1 className="text-3xl text-primary font-bold mb-8">
        Chọn các dịch vụ cho buổi tiệc
      </h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <h1 className="text-2xl text-primary">Loading...</h1>
        </div>
      ) : (
        <ServiceCardList services={services} onSelect={onChooseService} />
      )}
    </div>
  );
};

export default ServiceShowingStep;
