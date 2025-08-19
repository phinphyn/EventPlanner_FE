import React, { useState } from 'react';
import roomService from '../../../services/roomService';
import type { Room } from '../RoomListAdmin';

interface CreateRoomProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Partial<Room>>({
    room_name: '',
    guest_capacity: 0,
    base_price: 0,
    status: 'AVAILABLE',
    is_active: true,
  });
  const [formImages, setFormImages] = useState<File[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
      const files = Array.from(e.target.files);
      setFormImages((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  const handleRemoveImage = (idx: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
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
      // Append all images
      if (formImages.length > 0) {
        formImages.forEach((img) => form.append('image', img)); // matches upload.array("image")
      }

      await roomService.api.request('/', 'POST', form);
      onSuccess();
    } catch (err) {
      alert('Lưu phòng thất bại');
      console.log(err);
    } finally {
      setFormLoading(false);
      // Clean up previews
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    }
  };

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
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h2
            className="text-2xl font-bold mb-4 text-center text-primary"
            style={{ color: 'var(--primary)' }}
          >
            Thêm phòng mới
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
            <label className="block font-semibold mb-1">Hoạt động</label>
            <input
              type="checkbox"
              name="is_active"
              checked={!!formData.is_active}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Hình ảnh phòng</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mb-2"
            />
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {imagePreviews.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden border border-gray-200 shadow bg-gray-50"
                    style={{
                      width: 100,
                      height: 75,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      className="object-cover w-full h-full"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs text-red-500 hover:bg-red-100"
                      title="Xoá ảnh"
                      onClick={() => handleRemoveImage(idx)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              onClick={onClose}
              disabled={formLoading}
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-white hover:bg-secondary transition"
              disabled={formLoading}
            >
              {formLoading ? 'Đang lưu...' : 'Lưu phòng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateRoom;
