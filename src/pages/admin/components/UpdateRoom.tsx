import React, { useState } from 'react';
import roomService from '../../../services/roomService';
import type { Room } from '../RoomListAdmin';

interface UpdateRoomProps {
  room: Room;
  onClose: () => void;
  onSuccess: () => void;
}

const UpdateRoom: React.FC<UpdateRoomProps> = ({
  room,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<Room>>({ ...room });
  const [formImages, setFormImages] = useState<File[]>([]);
  const [formLoading, setFormLoading] = useState(false);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const type = (e.target as HTMLInputElement).type;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev: Partial<Room>) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormImages(Array.from(e.target.files));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const form = new FormData();
      const excludeKeys = ['room_id', 'created_at', 'updated_at', 'images'];
      const entries = Object.entries(formData).filter(
        ([key]) => !excludeKeys.includes(key),
      );
      entries.forEach(([key, value]) => {
        if (value !== undefined && value !== null)
          form.append(key, String(value));
      });
      if (formImages.length > 0) {
        form.append('image', formImages[0]);
      }
      await roomService.api.request(`/${room.room_id}`, 'PUT', form);
      onSuccess();
    } catch (err) {
      alert('Lưu phòng thất bại');
      console.log(err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
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
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h2
            className="text-lg font-bold mb-2"
            style={{ color: 'var(--primary)' }}
          >
            Cập nhật phòng
          </h2>
          <div>
            <label className="block font-semibold mb-1">Tên phòng</label>
            <input
              type="text"
              name="room_name"
              value={formData.room_name || ''}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Sức chứa</label>
            <input
              type="number"
              name="guest_capacity"
              value={formData.guest_capacity || ''}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Giá cơ bản</label>
            <input
              type="number"
              name="base_price"
              value={formData.base_price || ''}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Trạng thái</label>
            <select
              name="status"
              value={formData.status || 'AVAILABLE'}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="UNAVAILABLE">UNAVAILABLE</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Hoạt động</label>
            <input
              type="checkbox"
              name="is_active"
              checked={!!formData.is_active}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Ảnh phòng</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {formImages.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                {formImages[0].name}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
              disabled={formLoading}
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={formLoading}
            >
              {formLoading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRoom;
