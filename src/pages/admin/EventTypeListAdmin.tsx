import { useEffect, useState } from 'react';
import Datatable from '@/components/common/Datatable';
import eventTypeService from '@/services/eventType.service';
import type { EventType } from '@/services/eventType.service';
import CreateEventType from '../admin/components/CreateEventType';
import UpdateEventType from '../admin/components/UpdateEventType';
import EventTypeDetail from '../admin/components/EventTypeDetail';
import type { ApiResponse } from '@/services/api.service';
import { toast } from 'react-toastify';

const EventTypeListAdmin = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(
    null,
  );
  const [modalType, setModalType] = useState<'view' | 'edit' | 'create' | null>(
    null,
  );
  const [deleteConfirmEventType, setDeleteConfirmEventType] =
    useState<EventType | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const fetchEventTypes = async (params: { search?: string } = {}) => {
    setLoading(true);
    setError('');
    try {
      // Pass search param to API if present
      let res: ApiResponse<EventType[]>;
      if (params.search && params.search.trim()) {
        res = await eventTypeService.api.request(
          `/?search=${encodeURIComponent(params.search.trim())}`,
          'GET',
        );
      } else {
        res = await eventTypeService.getAllEventTypes();
      }
      setEventTypes(res.data || []);
    } catch (err) {
      setError('Lỗi tải danh sách loại sự kiện');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchEventTypes({ search });
  };

  const handleView = (eventType: EventType) => {
    setSelectedEventType(eventType);
    setModalType('view');
  };

  const handleEdit = (eventType: EventType) => {
    setSelectedEventType(eventType);
    setModalType('edit');
  };

  const handleCreate = () => {
    setSelectedEventType(null);
    setModalType('create');
  };

  const handleDelete = (eventType: EventType) => {
    setDeleteConfirmEventType(eventType);
  };

  const confirmDeleteEventType = async () => {
    if (!deleteConfirmEventType) return;
    setDeleteLoading(true);
    setError('');
    try {
      await eventTypeService.api.request(
        `/${deleteConfirmEventType.type_id}`,
        'DELETE',
      );
      fetchEventTypes();
      setDeleteConfirmEventType(null);
    } catch (err) {
      alert('Xóa loại sự kiện thất bại');
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeleteEventType = () => {
    setDeleteConfirmEventType(null);
  };

  const closeModal = () => {
    setSelectedEventType(null);
    setModalType(null);
  };

  const columns = [
    { Header: 'ID', accessor: 'type_id' },
    { Header: 'Tên loại sự kiện', accessor: 'type_name' },
    { Header: 'Mô tả', accessor: 'description' },
  ];

  return (
    <div className="p-6">
      {error && toast.error(error)}
      <div className="flex justify-between items-center mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm loại sự kiện..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Tìm kiếm
          </button>
        </form>
        <button
          onClick={handleCreate}
          className="bg-secondary hover:bg-tertiary text-white px-4 py-2 rounded"
        >
          Thêm loại sự kiện
        </button>
      </div>
      <Datatable
        columns={columns}
        data={eventTypes}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {modalType === 'view' && selectedEventType && (
        <EventTypeDetail eventType={selectedEventType} onClose={closeModal} />
      )}
      {modalType === 'edit' && selectedEventType && (
        <UpdateEventType
          eventType={selectedEventType}
          onClose={closeModal}
          onSuccess={fetchEventTypes}
        />
      )}
      {modalType === 'create' && (
        <CreateEventType onClose={closeModal} onSuccess={fetchEventTypes} />
      )}
      {deleteConfirmEventType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in">
            <h2 className="text-lg font-bold mb-2">
              Xác nhận xóa loại sự kiện
            </h2>
            <p>
              Bạn có chắc muốn xóa loại sự kiện "
              {deleteConfirmEventType.type_name}"?
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-300"
                onClick={cancelDeleteEventType}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white"
                onClick={confirmDeleteEventType}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTypeListAdmin;
