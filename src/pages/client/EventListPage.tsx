import EventCardList from '@/components/client/EventListPage/EventCardList';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

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

const mockEvents: Event[] = [
  {
    event_id: 1,
    event_name: 'Summer Wedding Celebration',
    description: 'A beautiful summer wedding with garden reception',
    event_date: new Date('2024-07-15'),
    start_time: new Date('2024-07-15T14:00:00'),
    end_time: new Date('2024-07-15T22:00:00'),
    estimated_cost: 5000.0,
    status: 'PENDING',
    event_type: { name: 'Wedding' },
  },
  {
    event_id: 2,
    event_name: 'Corporate Annual Meeting',
    description: 'Annual company meeting and networking event',
    event_date: new Date('2024-06-20'),
    start_time: new Date('2024-06-20T09:00:00'),
    end_time: new Date('2024-06-20T17:00:00'),
    estimated_cost: 3500.0,
    status: 'CONFIRMED',
    event_type: { name: 'Corporate' },
  },
  {
    event_id: 3,
    event_name: 'Birthday Gala',
    description: 'Luxurious birthday celebration',
    event_date: new Date('2024-08-10'),
    start_time: new Date('2024-08-10T18:00:00'),
    end_time: new Date('2024-08-10T23:00:00'),
    estimated_cost: 2500.0,
    status: 'PENDING',
    event_type: { name: 'Birthday' },
  },
];

const EventListPage = () => {
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sự kiện', href: '/events' },
  ];

  return (
    <div className='px-16 py-4'>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={index}>
              {item.href === '/events' ? (
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
      <div className='container mx-auto py-8'>
        <EventCardList events={mockEvents} />
      </div>
    </div>
  );
};

export default EventListPage;
