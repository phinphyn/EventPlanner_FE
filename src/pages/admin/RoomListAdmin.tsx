import React, { useEffect, useState } from 'react';
import Datatable from '../../components/common/Datatable';
import roomService from '../../services/roomService';
import CreateRoom from './components/CreateRoom';
import UpdateRoom from './components/UpdateRoom';
import RoomDetail from './components/RoomDetail';

export interface Room {
  room_id: number;
  room_name: string;
  guest_capacity?: number;
  base_price?: number;
  status?: string;
  is_active?: boolean;
  [key: string]: unknown;
  images?: { id: number; url: string }[];
}

const RoomListAdmin = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'create' | null>(
    null,
  );
  const [deleteConfirmRoom, setDeleteConfirmRoom] = useState<Room | null>(null);
  // Form state moved to subcomponents
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const fetchRooms = async (
    params: { search?: string; page?: number } = {},
  ) => {
    setLoading(true);
    setError('');
    try {
      const res = await roomService.getAllRooms({
        includeImages: true,
        search: params.search ?? search,
        page: params.page ?? page,
        limit: pageSize,
      });
      console.log(res.data);
      setRooms(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch {
      setError('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchRooms({ search, page: 1 });
  };

  const handleView = (room: Room) => {
    setSelectedRoom(room);
    setModalType('view');
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setModalType('edit');
  };

  const handleCreate = () => {
    setSelectedRoom(null);
    setModalType('create');
  };

  const handleDelete = (room: Room) => {
    setDeleteConfirmRoom(room);
  };

  const confirmDeleteRoom = async () => {
    if (!deleteConfirmRoom) return;
    setDeleteLoading(true);
    try {
      await roomService.deleteRoom(deleteConfirmRoom.room_id.toString());
      fetchRooms();
      setDeleteConfirmRoom(null);
    } catch {
      alert('Xoá phòng thất bại');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeleteRoom = () => {
    setDeleteConfirmRoom(null);
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setModalType(null);
  };

  // Form logic moved to CreateRoom and UpdateRoom components

  return (
    <div className="p-6 bg-muted-foreground rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
          Danh sách phòng
        </h1>
        <button
          className="bg-secondary text-white px-4 py-2 rounded hover:bg-tertiary transition"
          onClick={handleCreate}
        >
          + Thêm phòng mới
        </button>
      </div>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Tìm kiếm tên phòng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64 placeholder-amber-50"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-primary text-white hover:bg-secondary"
        >
          Tìm kiếm
        </button>
      </form>
      {error && (
        <div className="mb-4" style={{ color: 'var(--destructive)' }}>
          {error}
        </div>
      )}
      <Datatable
        columns={[
          { Header: 'ID', accessor: 'room_id' },
          { Header: 'Tên phòng', accessor: 'room_name' },
          { Header: 'Sức chứa', accessor: 'guest_capacity' },
          { Header: 'Giá cơ bản', accessor: 'base_price' },
          { Header: 'Trạng thái', accessor: 'status' },
          {
            Header: 'Hoạt động',
            accessor: 'is_active',
            Cell: ({ value }) => (value ? '✔️' : '❌'),
          },
        ]}
        data={rooms}
        loading={loading || deleteLoading}
        rowClassName="hover:bg-indigo-50 transition"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <div className="flex justify-end items-center gap-2 mt-4">
        <button
          className="px-3 py-1 text-white border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 text-white border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal for view/edit/create */}
      {modalType === 'view' && selectedRoom && (
        <RoomDetail room={selectedRoom} onClose={closeModal} />
      )}
      {modalType === 'edit' && selectedRoom && (
        <UpdateRoom
          room={selectedRoom}
          onClose={closeModal}
          onSuccess={() => {
            fetchRooms();
            closeModal();
          }}
        />
      )}
      {modalType === 'create' && (
        <CreateRoom
          onClose={closeModal}
          onSuccess={() => {
            fetchRooms();
            closeModal();
          }}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in border border-gray-200">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
              onClick={cancelDeleteRoom}
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
              className="text-xl font-bold mb-4 text-center text-primary"
              style={{ color: 'var(--primary)' }}
            >
              Xác nhận xoá phòng
            </h2>
            <div className="mb-6 text-center text-lg">
              Bạn có chắc chắn muốn xoá phòng{' '}
              <span className="font-semibold text-red-600">
                "{deleteConfirmRoom.room_name}"
              </span>
              ?
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={cancelDeleteRoom}
                disabled={deleteLoading}
              >
                Huỷ
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-bold shadow"
                onClick={confirmDeleteRoom}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Đang xoá...' : 'Xoá phòng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomListAdmin;
