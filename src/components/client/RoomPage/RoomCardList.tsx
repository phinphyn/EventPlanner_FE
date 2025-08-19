import React, { useState, useEffect } from 'react';
import type { Room } from '@/services/roomService';

const PLACEHOLDER_IMAGE =
  'https://www.pngkey.com/png/detail/470-4703342_generic-placeholder-image-conference-room-free-icon.png';

interface RoomCardProps {
  room: Room;
  onSelect?: (room: Room) => void;
  onChoose?: (room: Room) => void;
  chosen?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onSelect,
  onChoose,
  chosen,
}) => {
  const handleCardClick = () => {
    if (onChoose) {
      onChoose(room);
    } else if (onSelect) {
      onSelect(room);
    }
  };

  const imageUrl =
    room.images && room.images.length > 0
      ? room.images[0].image_url
      : PLACEHOLDER_IMAGE;

  return (
    <div
      className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden group"
      onClick={handleCardClick}
    >
      {onChoose && (
        <div
          className={`absolute top-3 right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
            chosen
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-gray-300 text-gray-400'
          }`}
        >
          {chosen ? '✓' : ''}
        </div>
      )}

      {/* Room Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={room.room_name}
          loading="lazy"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {room.room_name}
          </h3>
        </div>

        {room.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-1">
            {room.description}
          </p>
        )}

        <div className="flex items-center gap-1 mb-2">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5V4H2v16h5m10 0V4m-5 0v16"
            />
          </svg>
          <span>{room.guest_capacity} khách</span>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-700">
          <div className="font-semibold text-lg text-blue-600">
            {Number(room.base_price).toLocaleString()}₫
          </div>

          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              room.status === 'AVAILABLE'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {room.status}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 text-right">
        {onChoose && !onSelect ? (
          <button
            className={`${
              chosen
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            } px-4 py-2 rounded-lg font-medium transition-colors duration-200`}
            onClick={(e) => {
              e.stopPropagation();
              if (onChoose) onChoose(room);
            }}
          >
            {chosen ? 'Selected' : 'Select'}
          </button>
        ) : (
          <button
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelect) onSelect(room);
            }}
          >
            View Details →
          </button>
        )}
      </div>
    </div>
  );
};

interface RoomCardListProps {
  rooms?: Room[];
  loading?: boolean;
  onRoomSelect?: (room: Room) => void;
  onChoose?: (room: Room) => void;
  className?: string;
}

const RoomCardList: React.FC<RoomCardListProps> = ({
  rooms = [],
  loading = false,
  onRoomSelect,
  onChoose,
  className = '',
}) => {
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [chosenRoomId, setChosenRoomId] = useState<number | null>(null);

  useEffect(() => {
    const activeRooms = rooms.filter((room) => room.is_active);
    setFilteredRooms(activeRooms);
  }, [rooms]);

  const handleChoose = (room: Room) => {
    setChosenRoomId(room.room_id);
    if (onChoose) onChoose(room);
  };

  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      >
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md border border-gray-200 animate-pulse p-6"
          >
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredRooms.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Rooms Available
        </h3>
        <p className="text-gray-500">
          There are currently no rooms available for booking.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {filteredRooms.map((room) => (
        <RoomCard
          key={room.room_id}
          room={room}
          onSelect={onRoomSelect}
          onChoose={onChoose ? handleChoose : undefined}
          chosen={chosenRoomId === room.room_id}
        />
      ))}
    </div>
  );
};

export default RoomCardList;
