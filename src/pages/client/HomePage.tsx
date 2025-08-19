import EventTypeList from '@/components/client/HomePage/CategoryList';
import CreateEventBanner from '@/components/client/HomePage/CreateEventBanner';
import Hero from '@/components/client/HomePage/Hero';
import PopularEvents from '@/components/client/HomePage/PopularEvents';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <EventTypeList />
      <PopularEvents />
      <CreateEventBanner />
    </div>
  );
};

export default HomePage;
