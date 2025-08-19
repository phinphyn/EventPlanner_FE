import eventTypeService from '@/services/eventType.service';
import React from 'react';

type EventType = {
  type_id: number;
  type_name: string;
  description: string;
};

type ApiResponse<T> = {
  data: T;
  message: string;
  meta?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  status: string;
  statusCode: number;
};

const EventTypeItem = ({
  category,
  index,
}: {
  category: EventType;
  index: number;
}) => {
  const gradients = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-pink-500 to-rose-600',
    'from-orange-500 to-red-600',
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-teal-500 to-green-600',
    'from-red-500 to-orange-600',
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-lg bg-white cursor-pointer transform transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      ></div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10">
        <div
          className={`w-full h-full bg-gradient-to-br ${gradient} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
        ></div>
      </div>

      {/* Content */}
      <div className="relative p-8 py-12">
        {/* Icon placeholder - you can replace with actual icons */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-center text-2xl font-bold mb-4 text-gray-800 group-hover:text-gray-900 transition-colors duration-300 line-clamp-1">
          {category.type_name}
        </h3>

        <p className="text-center text-gray-600 group-hover:text-gray-700 transition-colors duration-300 line-clamp-3 leading-relaxed">
          {category.description}
        </p>

        {/* Hover indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-gray-200 rounded-2xl p-8 py-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          </div>
          <div className="h-6 bg-gray-300 rounded-lg mb-4 mx-auto w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EventTypeList = () => {
  const [eventTypes, setEventTypes] = React.useState<EventType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchEventTypes = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse<EventType[]> =
        await eventTypeService.getAllEventTypes();
      const eventTypesData: EventType[] = response.data;
      setEventTypes(eventTypesData);
    } catch (error) {
      console.error('Error fetching event types:', error);
      setError('Không thể tải danh mục sự kiện. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEventTypes();
  }, []); // Fixed: Added dependency array to prevent infinite re-renders

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Oops! Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchEventTypes}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto py-16 px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
            Danh mục sự kiện
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Khám phá các loại sự kiện đa dạng và tìm kiếm những trải nghiệm phù
            hợp với sở thích của bạn
          </p>

          {/* Decorative line */}
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <LoadingSkeleton />
        ) : eventTypes?.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Chưa có danh mục nào
            </h3>
            <p className="text-gray-600">
              Hiện tại chưa có danh mục sự kiện nào được tạo.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
              {eventTypes?.length !== 0 &&
                eventTypes?.map((category, index) => (
                  <EventTypeItem
                    key={category.type_id}
                    category={category}
                    index={index}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventTypeList;
