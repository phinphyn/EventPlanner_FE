import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils/formatCurrency';

type Event = {
  event_id: number;
  event_name: string;
  description: string;
  event_date: Date;
  start_time: Date;
  end_time: Date;
  estimated_cost: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  event_type: {
    name: string;
  };
};

const EventCard = ({ event }: { event: Event }) => {
  return (
    <Card
      key={event.event_id}
      className="hover:shadow-lg transition-shadow flex flex-col"
    >
      <CardHeader>
        <CardTitle className="text-xl line-clamp-1">
          {event.event_name}
        </CardTitle>
        <CardDescription>{event.event_type.name}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Add flex-grow here */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600 line-clamp-1">
            {event.description}
          </p>
          <p className="font-semibold">
            Giá dự kiến: {formatCurrency(event.estimated_cost)}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/events/${event.event_id}`} className="w-full">
          <Button className="w-full">Xem chi tiết</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
