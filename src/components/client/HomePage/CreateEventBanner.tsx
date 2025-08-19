import { Calendar, Tent } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateEventBanner = () => {
  return (
    <section className="relative bg-tertiary py-16 px-6 overflow-hidden mt-12">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="absolute top-4 left-10 w-32 h-32"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M20 50 Q 50 20, 80 50 Q 50 80, 20 50"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          />
        </svg>
        <svg
          className="absolute top-20 right-20 w-24 h-24"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M30 30 Q 70 10, 90 50 Q 70 90, 30 70 Q 10 30, 30 30"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          />
        </svg>
        <svg
          className="absolute bottom-10 left-1/4 w-28 h-28"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M10 60 Q 40 20, 70 40 Q 90 70, 60 90 Q 30 80, 10 60"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          />
        </svg>
        <svg
          className="absolute bottom-16 right-10 w-20 h-20"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M25 25 Q 75 5, 95 45 Q 75 85, 25 65 Q 5 25, 25 25"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          />
        </svg>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Side - Icon and Text */}
          <div className="flex items-center gap-6 flex-1">
            {/* Event Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                <Tent size={32} className="text-tertiary" />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                Tạo sự kiện với Gazer
              </h2>
              <p className="text-gray-300 text-base lg:text-lg leading-relaxed max-w-2xl">
                Bạn có chương trình biểu diễn, sự kiện, hoạt động hay trải
                nghiệm tuyệt vời? Hãy hợp tác với chúng tôi và được niêm yết
                trên Gazer
              </p>
            </div>
          </div>

          {/* Right Side - CTA Button */}
          <div className="flex-shrink-0">
            <Link
              to={'/bookings'}
              className="bg-primary text-tertiary px-8 py-4 rounded-lg hover:bg-secondary transition-all duration-300 font-semibold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Calendar size={24} />
              Tạo sự kiện
            </Link>
          </div>
        </div>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary opacity-30"></div>
    </section>
  );
};

export default CreateEventBanner;
