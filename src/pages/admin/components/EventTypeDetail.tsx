import type { EventType } from '@/services/eventType.service';

interface EventTypeDetailProps {
  eventType: EventType;
  onClose: () => void;
}

const EventTypeDetail: React.FC<EventTypeDetailProps> = ({
  eventType,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in border border-gray-200">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
          onClick={onClose}
          title="Đóng"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2
          className="text-2xl font-bold mb-4 text-center text-primary"
          style={{ color: 'var(--primary)' }}
        >
          Thông tin loại sự kiện
        </h2>
        <div className="space-y-3 mb-6">
          <div>
            <span className="font-semibold">ID:</span> {eventType.type_id}
          </div>
          <div>
            <span className="font-semibold">Tên loại sự kiện:</span>{' '}
            {eventType.type_name}
          </div>
          <div>
            <span className="font-semibold">Mô tả:</span>{' '}
            {eventType.description}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 rounded bg-primary text-white hover:bg-secondary transition"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventTypeDetail;
