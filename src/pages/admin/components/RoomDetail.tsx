import React from 'react';
import type { Room } from '../RoomListAdmin';

interface RoomDetailProps {
  room: Room;
  onClose: () => void;
}

const RoomDetail: React.FC<RoomDetailProps> = ({ room, onClose }) => {
  // Images: room.images is expected to be an array of { image_url, ... }
  type RoomImage = { image_url: string; alt_text?: string };
  const images: RoomImage[] = Array.isArray(
    room.images as RoomImage[] | undefined,
  )
    ? (room.images as RoomImage[])
    : [];

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
          Thông tin phòng
        </h2>
        <div className="space-y-3 mb-6">
          <div>
            <span className="font-semibold">ID:</span> {room.room_id}
          </div>
          <div>
            <span className="font-semibold">Tên phòng:</span> {room.room_name}
          </div>
          <div>
            <span className="font-semibold">Sức chứa:</span>{' '}
            {room.guest_capacity}
          </div>
          <div>
            <span className="font-semibold">Giá cơ bản:</span> {room.base_price}
          </div>
          <div>
            <span className="font-semibold">Trạng thái:</span> {room.status}
          </div>
          <div>
            <span className="font-semibold">Hoạt động:</span>{' '}
            {room.is_active ? (
              <span className="text-green-600 font-bold">✔️</span>
            ) : (
              <span className="text-red-500 font-bold">❌</span>
            )}
          </div>
        </div>
        {images.length > 0 && (
          <div className="mb-2">
            <div className="font-semibold mb-2 text-primary">
              Hình ảnh phòng
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden border border-gray-200 shadow hover:shadow-lg transition-all bg-gray-50"
                  style={{
                    width: 120,
                    height: 90,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || `Room image ${idx + 1}`}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {images.length === 0 && (
          <div className="text-center text-gray-400 italic mb-2">
            Không có hình ảnh cho phòng này.
          </div>
        )}
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

export default RoomDetail;
