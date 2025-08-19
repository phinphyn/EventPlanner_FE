import { BookingPageContainer } from '@/components/client/BookingPage/BookingPageContainer';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { StepFormProvider } from '@/context/StepFormContext';

const breadcrumbItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Tạo sự kiện', href: '/bookings' },
];

const BookingPage = () => {
  return (
    <div className="px-16 py-4">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center">
          {breadcrumbItems.map((item, index) => (
            <div
              key={`breadcrumb-item-${index}`}
              className="flex items-center gap-2"
            >
              <BreadcrumbItem>
                {item.href === '/bookings' ? (
                  <BreadcrumbPage>
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <StepFormProvider>
        <BookingPageContainer />
      </StepFormProvider>
    </div>
  );
};

export default BookingPage;
