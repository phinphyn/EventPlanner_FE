import React, { useEffect, useState } from 'react';
import Datatable from '@/components/common/Datatable';
import serviceTypeService from '@/services/serviceTypeService';
import CreateServiceType from '../admin/components/CreateServiceType';
import UpdateServiceType from '../admin/components/UpdateServiceType';
import ServiceTypeDetail from '../admin/components/ServiceTypeDetail';
import { toast } from 'react-toastify';

export interface ServiceType {
  service_type_id: number;
  service_type_name: string;
  category?: string;
  description?: string;
  is_active?: boolean;
  [key: string]: unknown;
}

const ServiceTypeListAdmin = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceType | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'create' | null>(
    null,
  );
  const [deleteConfirmServiceType, setDeleteConfirmServiceType] =
    useState<ServiceType | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const fetchServiceTypes = async (
    params: { search?: string; page?: number } = {},
  ) => {
    setLoading(true);
    setError('');
    try {
      const res = await serviceTypeService.getAllServiceTypes({
        search: params.search || search,
        page: params.page || page,
        limit: pageSize,
      });
      setServiceTypes(res.data?.serviceTypes || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError('Lỗi tải danh sách loại dịch vụ');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError('');
    }
    fetchServiceTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchServiceTypes({ search, page: 1 });
  };

  const handleView = (serviceType: ServiceType) => {
    setSelectedServiceType(serviceType);
    setModalType('view');
  };

  const handleEdit = (serviceType: ServiceType) => {
    setSelectedServiceType(serviceType);
    setModalType('edit');
  };

  const handleCreate = () => {
    setSelectedServiceType(null);
    setModalType('create');
  };

  const handleDelete = (serviceType: ServiceType) => {
    setDeleteConfirmServiceType(serviceType);
  };

  const confirmDeleteServiceType = async () => {
    if (!deleteConfirmServiceType) return;
    setDeleteLoading(true);
    try {
      await serviceTypeService.deleteServiceType(
        String(deleteConfirmServiceType.service_type_id),
      );
      fetchServiceTypes();
      setDeleteConfirmServiceType(null);
    } catch (err) {
      console.log(err);
      alert('Xóa loại dịch vụ thất bại');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeleteServiceType = () => {
    setDeleteConfirmServiceType(null);
  };

  const closeModal = () => {
    setSelectedServiceType(null);
    setModalType(null);
  };

  const columns = [
    { Header: 'ID', accessor: 'service_type_id' },
    { Header: 'Tên loại dịch vụ', accessor: 'service_type_name' },
    { Header: 'Danh mục', accessor: 'category' },
    { Header: 'Mô tả', accessor: 'description' },
    {
      Header: 'Hoạt động',
      accessor: 'is_active',
      Cell: ({ value }: { value: boolean }) => (value ? '✔️' : '❌'),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
          Quản lý loại dịch vụ
        </h1>
        <button
          className="px-4 py-2 bg-secondary hover:bg-tertiary text-white rounded"
          onClick={handleCreate}
        >
          Thêm loại dịch vụ
        </button>
      </div>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Tìm kiếm loại dịch vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Tìm kiếm
        </button>
      </form>
      <Datatable
        columns={columns}
        data={serviceTypes}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 mx-1 border rounded"
        >
          Trước
        </button>
        <span className="px-3 py-1">
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 mx-1 border rounded"
        >
          Sau
        </button>
      </div>
      {/* Modals */}
      {modalType === 'view' && selectedServiceType && (
        <ServiceTypeDetail
          serviceType={selectedServiceType}
          onClose={closeModal}
        />
      )}
      {modalType === 'edit' && selectedServiceType && (
        <UpdateServiceType
          serviceType={selectedServiceType}
          onClose={closeModal}
          onSuccess={fetchServiceTypes}
        />
      )}
      {modalType === 'create' && (
        <CreateServiceType onClose={closeModal} onSuccess={fetchServiceTypes} />
      )}
      {/* Delete confirm modal */}
      {deleteConfirmServiceType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in">
            <h2
              className="text-lg font-bold mb-2"
              style={{ color: 'var(--primary)' }}
            >
              Xác nhận xóa loại dịch vụ
            </h2>
            <p>
              Bạn có chắc muốn xóa loại dịch vụ "
              {deleteConfirmServiceType.service_type_name}"?
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={cancelDeleteServiceType}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white"
                onClick={confirmDeleteServiceType}
                disabled={deleteLoading}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTypeListAdmin;
