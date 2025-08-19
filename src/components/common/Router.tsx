import AdminLayout from '@/layouts/AdminLayout';
import CustomerLayout from '@/layouts/CustomerLayout';
import EventListPage from '@/pages/client/EventListPage';
import HomePage from '@/pages/client/HomePage';
import RoomListAdmin from '@/pages/admin/RoomListAdmin';
import EventTypeListAdmin from '@/pages/admin/EventTypeListAdmin';
import LoginPage from '@/pages/client/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from '@/pages/client/RegisterPage';
import BookingPage from '@/pages/client/BookingPage';
import EventDetailPage from '@/pages/client/EventDetailPage';
import ServiceListPage from '@/pages/client/ServiceListPage';
import ServiceDetailPage from '@/pages/client/ServiceDetailPage';
import ServiceTypeListAdmin from '@/pages/admin/ServiceTypeListAdmin';
import ServiceListAdmin from '@/pages/admin/ServiceListAdmin';
import DashboardPage from '@/pages/admin/DashboardPage';
import ProfilePage from '@/pages/client/ProfilePage';
import BookingHistoryTab from '../client/ProfilePage/BookingHistoryTab';
import ChangePasswordTab from '../client/ProfilePage/ChangePasswordTab';
import PersonalInfoTab from '../client/ProfilePage/PersonalInfoTab';
import PaymentStatusPage from '@/pages/client/PaymentStatusPage';
import AdminEventsPage from '@/pages/admin/EventPage';
import RoomListPage from '@/pages/client/RoomListPage';
import AboutUs from '../client/AboutUsPage/AboutUs';
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        {/* Customer routes */}
        <Route
          path="/"
          element={
            <CustomerLayout>
              <HomePage />
            </CustomerLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <CustomerLayout>
              <ProfilePage />
            </CustomerLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <CustomerLayout>
              <ProfilePage />
            </CustomerLayout>
          }
        >
          <Route path="me" element={<PersonalInfoTab />} />
          <Route path="booking-history" element={<BookingHistoryTab />} />
          <Route path="change-password" element={<ChangePasswordTab />} />
        </Route>

        <Route
          path="/services"
          element={
            <CustomerLayout>
              <ServiceListPage />
            </CustomerLayout>
          }
        />

        <Route
          path="/services/:id"
          element={
            <CustomerLayout>
              <ServiceDetailPage />
            </CustomerLayout>
          }
        />

        <Route
          path="/rooms"
          element={
            <CustomerLayout>
              <RoomListPage />
            </CustomerLayout>
          }
        />

        {/* <Route
          path="/rooms/:id"
          element={
            <CustomerLayout>
              <ServiceDetailPage />
            </CustomerLayout>
          }
        /> */}

        <Route
          path="/events"
          element={
            <CustomerLayout>
              <EventListPage />
            </CustomerLayout>
          }
        />

        <Route
          path="/events/:eventId"
          element={
            <CustomerLayout>
              <EventDetailPage />
            </CustomerLayout>
          }
        />

        <Route
          path="/bookings"
          element={
            <CustomerLayout>
              <BookingPage />
            </CustomerLayout>
          }
        />

        <Route
          path="/payment/stripe-pay-callback"
          element={
            <CustomerLayout>
              <PaymentStatusPage />
            </CustomerLayout>
          }
        />

        <Route
          path="/about-us"
          element={
            <CustomerLayout>
              <AboutUs />
            </CustomerLayout>
          }
        />

        {/* Admin routes */}

        <Route
          path="/admin/rooms"
          element={
            <AdminLayout>
              {/* RoomListAdmin will show the list of rooms */}
              <RoomListAdmin />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/services"
          element={
            <AdminLayout>
              {/* RoomListAdmin will show the list of rooms */}
              <ServiceListAdmin />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/event-types"
          element={
            <AdminLayout>
              {/* EventTypeListAdmin will show the list of event types */}
              <EventTypeListAdmin />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/service-types"
          element={
            <AdminLayout>
              {/* EventTypeListAdmin will show the list of event types */}
              <ServiceTypeListAdmin />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/events"
          element={
            <AdminLayout>
              <AdminEventsPage />
            </AdminLayout>
          }
        />

        <Route
          path="*"
          element={
            <div className="flex justify-center items-center h-screen">404</div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
