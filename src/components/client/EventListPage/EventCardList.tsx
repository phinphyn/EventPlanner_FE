import EventCard from '../common/EventCard';

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

const EventCardList = ({ events }: { events: Event[] }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {events.map((event) => (
        <EventCard key={event.event_id} event={event} />
      ))}
    </div>
  );
};

export default EventCardList;
