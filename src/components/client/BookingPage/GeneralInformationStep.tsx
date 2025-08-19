import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EventType } from '@/services/eventType.service';
import eventTypeService from '@/services/eventType.service';
import { toast } from 'react-toastify';
import { Textarea } from '@/components/ui/textarea';
import DatePicker from '@/components/ui/datepicker';
import useStepForm from '@/hooks/useStepForm';
import { Button } from '@/components/ui/button';

type EventInputs = {
  event_name: string;
  description: string;
  start_time: string;
  end_time: string;
  event_date: string;
  event_type_id: string;
};

type EventTypeSelectProps = {
  eventTypes: EventType[];
  onChange?: (value: string) => void;
};

const GeneralInformationStep = () => {
  const { register, handleSubmit, control, watch } = useForm<EventInputs>();
  const { updateField } = useStepForm();

  // Watch the selected date
  const selectedDate = watch('event_date');

  const [eventTypes, setEventTypes] = React.useState<EventType[]>([]);

  const onChangeEventType = (value: string) => {
    console.log('Selected event type ID:', value);
    updateField('event_type_id', value);
  };

  const onSubmit = (data: EventInputs) => {
    // Combine date and time for start_time and end_time
    const startDateTime = selectedDate
      ? new Date(selectedDate.split('T')[0] + 'T' + data.start_time)
      : data.start_time;
    const endDateTime = selectedDate
      ? new Date(selectedDate.split('T')[0] + 'T' + data.end_time)
      : data.end_time;

    updateField('event_name', data.event_name);
    updateField('description', data.description);
    updateField(
      'start_time',
      startDateTime instanceof Date
        ? startDateTime.toISOString()
        : startDateTime,
    );
    updateField(
      'end_time',
      endDateTime instanceof Date ? endDateTime.toISOString() : endDateTime,
    );
    updateField('event_date', data.event_date);
    toast.success('Thông tin sự kiện đã được cập nhật thành công!');
  };

  React.useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      const response = await eventTypeService.getAllEventTypes();

      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Failed to fetch event types');
      }

      setEventTypes(response.data);
    } catch (error) {
      console.error('Error fetching event types:', error);
      toast.error(
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-16 mx-auto">
      <h1 className="text-2xl text-primary font-bold mb-4">
        Thông tin sự kiện
      </h1>
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-24 md:max-w-full sm:max-w-1/2 my-4">
        <div className="flex w-full items-center gap-3">
          <Label htmlFor="event_name" className="flex-1">
            Tên sự kiện
          </Label>
          <Input
            type="text"
            placeholder="Nhập tên sự kiện"
            className="flex-5"
            {...register('event_name')}
          />
        </div>

        <div className="flex w-full items-center gap-3">
          <Label htmlFor="event_name" className="flex-1">
            Loại sự kiện
          </Label>

          <EventTypeSelect
            eventTypes={eventTypes}
            onChange={onChangeEventType}
          />
        </div>
      </div>

      <div className="md:max-w-1/2 sm:max-w-full my-8">
        <div className="flex flex-col w-full items-start justify-center gap-3">
          <Label htmlFor="event_name" className="flex-2">
            Mô tả sự kiện
          </Label>
          <Textarea
            placeholder="Nhập mô tả sự kiện"
            className="flex-5"
            {...register('description')}
          />
        </div>
      </div>

      <h1 className="text-2xl text-primary font-bold mb-4">
        Thông tin thời gian
      </h1>
      <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 md:max-w-full sm:max-w-1/2 my-4">
        <div className="flex w-full items-center gap-2">
          <Label htmlFor="event_date" className="flex-1">
            Ngày diễn ra
          </Label>
          <Controller
            control={control}
            name="event_date"
            render={({ field }) => (
              <DatePicker
                selectedDate={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date?.toISOString() ?? '')}
                placeholder="Chọn ngày diễn ra sự kiện"
              />
            )}
          />
        </div>
        <div className="flex w-full items-center gap-2">
          <Label htmlFor="event_name" className="flex-1">
            Giờ bắt đầu
          </Label>
          <Input
            type="time"
            id="time-picker"
            step="1"
            defaultValue={'10:00:00'}
            className="md:max-w-3/4 sm:max-w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            {...register('start_time')}
          />
        </div>
        <div className="flex w-full items-center gap-2">
          <Label htmlFor="event_name" className="flex-1">
            Giờ kết thúc
          </Label>
          <Input
            type="time"
            id="time-picker"
            step="1"
            defaultValue={'10:00:00'}
            className="md:max-w-3/4 sm:max-w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            {...register('end_time')}
          />
        </div>
      </div>
      <div className="w-full flex justify-center my-8">
        <Button className="text-white px-16 py-6">Xác nhận thông tin</Button>
      </div>
    </form>
  );
};

const EventTypeSelect: React.FC<EventTypeSelectProps> = ({
  eventTypes,
  onChange,
}) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-full flex-5">
        <SelectValue placeholder="Chọn loại sự kiện" />
      </SelectTrigger>
      <SelectContent>
        {eventTypes.length > 0 &&
          eventTypes.map((type) => (
            <SelectItem
              key={`event-type-${type.type_id}`}
              value={type.type_id.toString()}
            >
              {type.type_name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default GeneralInformationStep;
