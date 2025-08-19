import React from 'react';
import { defineStepper } from '@stepperize/react';
import GeneralInformationStep from './GeneralInformationStep';
import RoomShowingStep from './RoomShowingStep';
import { Button } from '@/components/ui/button';
import { IoIosArrowForward } from 'react-icons/io';
import ServiceShowingStep from './ServiceShowingStep';
import type { StepFormData } from '@/context/StepFormContext';
import useStepForm from '@/hooks/useStepForm';
import eventService from '@/services/eventService';
import type { Event, GetEventQueryType } from '@/services/eventService';
import { toast } from 'react-toastify';
import PaymentStep from './PaymentStep';
import VariantShowingStep from './VariantShowingStep';
import type {
  ServiceVariant,
  ServiceVariantQuery,
} from '@/services/eventVariantService';
import eventVariantService from '@/services/eventVariantService';
import ReviewStep from './ReviewStep';
import paymentService, {
  type PaymentCreationBody,
} from '@/services/paymentService';

// type BookingPageContainerProps = {
//   props?: React.ReactNode;
// };

const { useStepper, utils, steps } = defineStepper(
  {
    id: 'general-information',
    title: 'Thông tin chung',
    description: 'Cung cấp thông tin cơ bản về sự kiện',
  },
  {
    id: 'room-selection',
    title: 'Lựa chọn phòng',
    description: 'Chọn phòng cho sự kiện của bạn',
  },
  {
    id: 'service-selection',
    title: 'Lựa chọn dịch vụ',
    description:
      'Chọn dịch vụ kèm theo cho sự kiện (có thể chọn nhiều dịch vụ)',
  },
  {
    id: 'variant-selection',
    title: 'Lựa chọn gói dịch vụ',
    description: 'Chọn gói dịch vụ kèm theo cho sự kiện',
  },
  {
    id: 'review',
    title: 'Xem lại thông tin',
    description: 'Xem lại thông tin sự kiện',
  },
  {
    id: 'payment',
    title: 'Thanh toán',
    description: 'Thanh toán phí giữ chỗ',
  },
);

const account = localStorage.getItem('user');
const account_id = account !== null ? JSON.parse(account).account_id : 1;

export const BookingPageContainer = () => {
  const stepper = useStepper();

  const { data, updateField, resetForm } = useStepForm();
  const [variants, setVariants] = React.useState<ServiceVariant[]>([]);

  const [selectedVariants, setSelectedVariants] = React.useState<number[]>([]);

  const [event, setEvent] = React.useState<Event | null>(null);
  const [eventLoading, setEventLoading] = React.useState<boolean>(false);

  const currentIndex = utils.getIndex(stepper.current.id);

  const handleFetchEvent = async (eventId: string | number) => {
    setEventLoading(true);
    try {
      const queries: GetEventQueryType = {
        includeAccount: 'true',
        includeRoom: 'true',
        includeEventType: 'true',
        includeEventServices: 'true',
      };

      const response = await eventService.getEventById(
        eventId.toString(),
        queries,
      );

      console.log(response);

      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Internal Server Error');
      }

      toast.success(
        'Sự kiện đã tạo thành công. Vui lòng kiểm tra lại thông tin và xác nhận sự kiện',
      );

      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
      resetForm();
      stepper.reset();
    } finally {
      setEventLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    const rawData: StepFormData = {
      event_name: data.event_name,
      description: data.description,
      start_time: data.start_time,
      end_time: data.end_time,
      event_date: data.event_date,
      account_id: account_id,
      room_id: data.room_id,
      event_type_id: data.event_type_id,
    };

    const payload: StepFormData = {
      ...rawData,
      service_variants: data.selected_services
        ?.map((serviceId, index) => {
          const variantId = data.variation_id?.[index];
          if (typeof variantId === 'number') {
            return {
              service_id: serviceId,
              variant_id: variantId,
            };
          }
          return null;
        })
        .filter(
          (item): item is { service_id: number; variant_id: number } =>
            item !== null,
        ),
    };

    try {
      const response = await eventService.createEvent(payload);

      if (response.statusCode !== 201) {
        throw new Error(response.message || 'Internal Server Error');
      }

      console.log('event creation response: \n', response);

      handleFetchEvent(response.data.event_id);
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  };

  const handleConfirmEvent = async () => {
    try {
      const payload: PaymentCreationBody = {
        event_id: event?.event_id.toString() || '',
        userId: account_id,
      };

      const response = await paymentService.createPaymentSession(payload);

      console.log(response);

      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Internal Server Error');
      }

      const paymentUrl = response.data.stripeSession.url;

      window.open(paymentUrl, '_blank');
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  };

  const handleFetchVariants = async () => {
    const baseQuery: ServiceVariantQuery = {
      includePricingTiers: 'true',
      includeService: 'true',
    };

    const query: ServiceVariantQuery = {
      ...baseQuery,
    };

    data.selected_services?.forEach(async (serviceId) => {
      query.service_id = serviceId.toString();

      const variantsResponse = await eventVariantService.getAllServiceVariants(
        query,
      );

      setVariants(variantsResponse.data.variations);
    });
  };

  const handleSelectVariant = (variantId: number) => {
    console.log('Selected variant:', variantId);
    setSelectedVariants((prev) => [...prev, variantId]);
    updateField('variation_id', [...selectedVariants, variantId]);
  };

  const handleDeselectVariant = (variantId: number) => {
    console.log('Deselected variant:', variantId);
    setSelectedVariants((prev) => prev.filter((id) => id !== variantId));
  };

  const handleNextStep = () => {
    stepper.when('service-selection', handleFetchVariants);
    stepper.when('variant-selection', handleCreateEvent);
    stepper.next();
  };

  const handleReset = () => {
    resetForm();
    stepper.reset();
  };

  return (
    <div className="container py-12 mx-auto">
      <div className="container flex justify-center items-center gap-4 mb-24">
        {stepper.all.map((step, index, array) => (
          <div key={step.id} className="flex items-center gap-4">
            <li className="flex items-center gap-4 flex-shrink-0">
              <Button
                type="button"
                role="tab"
                variant={index <= currentIndex ? 'default' : 'secondary'}
                aria-current={
                  stepper.current.id === step.id ? 'step' : undefined
                }
                aria-posinset={index + 1}
                aria-setsize={steps.length}
                aria-selected={stepper.current.id === step.id}
                className="flex size-10 items-center justify-center rounded-full"
                onClick={() => stepper.goTo(step.id)}
              >
                {index + 1}
              </Button>
              <span className="text-sm font-medium">{step.title}</span>
            </li>
            {index < array.length - 1 && <IoIosArrowForward />}
          </div>
        ))}
      </div>
      <div className="space-y-8">
        {stepper.switch({
          'general-information': () => <GeneralInformationStep />,
          'room-selection': () => <RoomShowingStep />,
          'service-selection': () => <ServiceShowingStep />,
          'variant-selection': () => (
            <VariantShowingStep
              variants={variants}
              selectedVariants={selectedVariants}
              onVariantSelect={handleSelectVariant}
              onVariantDeselect={handleDeselectVariant}
            />
          ),
          review: () => (
            <ReviewStep
              eventData={event}
              loading={eventLoading}
              onReset={handleReset}
              onConfirm={handleConfirmEvent}
            />
          ),
          payment: () => <PaymentStep />,
        })}
        {!stepper.isLast ? (
          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={stepper.prev}
              disabled={stepper.isFirst}
            >
              Quay lại
            </Button>
            <Button onClick={handleNextStep}>Tiếp tục</Button>
          </div>
        ) : (
          <div className="flex justify-end gap-4">
            <Button onClick={handleReset}>Reset</Button>
            <Button onClick={handleCreateEvent}>Hoàn tất</Button>
          </div>
        )}
      </div>
    </div>
  );
};
