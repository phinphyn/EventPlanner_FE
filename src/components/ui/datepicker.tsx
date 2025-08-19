import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type DatePickerProps = {
  selectedDate?: Date;
  onChange?: (value: Date) => void;
  placeholder?: string;
};

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onChange,
  placeholder,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!selectedDate}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon />
          {selectedDate ? (
            format(new Date(selectedDate), 'PPP')
          ) : (
            <span>{placeholder || '-- Chọn ngày --'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          required
          mode="single"
          selected={selectedDate}
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
