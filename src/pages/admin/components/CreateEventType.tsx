import { useState } from 'react';
import eventTypeService from '@/services/eventType.service';

interface CreateEventTypeProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateEventType: React.FC<CreateEventTypeProps> = ({
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({ type_name: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await eventTypeService.createEventType(formData);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Tạo loại sự kiện thất bại');
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
            Thêm loại sự kiện
          </h2>
          <div>
            <input
              type="text"
              name="type_name"
              value={formData.type_name}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Tên loại sự kiện"
              required
            />
          </div>
          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Mô tả"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-white"
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

export default CreateEventType;
