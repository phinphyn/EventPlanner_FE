'use client';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import Datatable from '../../components/common/Datatable';
import serviceService from '../../services/serviceService';
import type { Service } from '../../services/serviceService';
import { formatDate } from '@/utils/format';
import ServiceDetail from './components/ServiceDetail';
import UpdateService from './components/UpdateService';
import CreateServiceModal from './components/CreateServiceModal';

const columns = [
  { Header: 'ID', accessor: 'service_id' },
  { Header: 'Tên dịch vụ', accessor: 'service_name' },
  { Header: 'Loại dịch vụ', accessor: 'service_type_id' },
  {
    Header: 'Trạng thái',
    accessor: 'is_active',
    Cell: ({ value }) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {value ? 'Hoạt động' : 'Ẩn'}
      </span>
    ),
  },
  {
    Header: 'Ngày cập nhật',
    accessor: 'updated_at',
    Cell: ({ value }: { value: string }) => formatDate(value),
  },
];

const ServiceListAdmin = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'create' | null>(
    null,
  );
  const [deleteConfirmService, setDeleteConfirmService] =
    useState<Service | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchServices = useCallback(
    async (params: { search?: string; page?: number } = {}) => {
      const isRefresh = params.page === page && params.search === search;
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const res = await serviceService.getAllServices({
          ...params,
          page: params.page ?? page,
          limit: pageSize,
          includeImages: true,
        });

        setServices(res.data.services);
        setTotalPages(res?.meta?.totalPages);
        setError('');
      } catch (err: any) {
        setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại.');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, pageSize],
  );

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchServices({ search, page: 1 });
  };

  const handleRefresh = () => {
    fetchServices({ search, page });
  };

  const handleView = async (service: Service) => {
    try {
      setLoading(true);
      const detailedService = await serviceService.getServiceById(
        service.service_id.toString(),
      );
      setSelectedService(detailedService.data);
      setModalType('view');
    } catch (error) {
      setError('Không thể tải chi tiết dịch vụ');
      console.error('Failed to load service details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setModalType('edit');
  };

  const handleCreate = () => {
    setModalType('create');
  };

  const handleDelete = async (service: Service) => {
    setDeleteConfirmService(service);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmService) return;
    setDeleteLoading(true);
    try {
      await serviceService.deleteService(
        deleteConfirmService.service_id.toString(),
      );
      await fetchServices();
      setDeleteConfirmService(null);
    } catch (err) {
      setError('Không thể xóa dịch vụ. Vui lòng thử lại.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalType(null);
    setSelectedService(null);
  };

  const handleSuccess = () => {
    fetchServices();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý dịch vụ
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả dịch vụ trong hệ thống
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={handleRefresh}
              disabled={refreshing}
              title="Làm mới"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
              />
              Làm mới
            </button>
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm"
              onClick={handleCreate}
            >
              <Plus className="w-4 h-4" />
              Thêm dịch vụ mới
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <form onSubmit={handleSearch} className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm tên dịch vụ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Có lỗi xảy ra</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <Datatable
          columns={columns}
          data={services}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Hiển thị {services.length} dịch vụ
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === 1 || loading}
              onClick={() => setPage(page - 1)}
            >
              Trước
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Trang {page} / {totalPages}
            </span>
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === totalPages || loading}
              onClick={() => setPage(page + 1)}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalType === 'view' && selectedService && (
        <ServiceDetail service={selectedService} onClose={handleModalClose} />
      )}

      {modalType === 'edit' && selectedService && (
        <UpdateService
          service={selectedService}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}

      {modalType === 'create' && (
        <CreateServiceModal
          open={modalType === 'create'}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Xác nhận xóa dịch vụ
                </h3>
                <p className="text-gray-600 text-sm">
                  Hành động này không thể hoàn tác
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Bạn có chắc muốn xóa dịch vụ{' '}
              <span className="font-semibold text-gray-900">
                "{deleteConfirmService.service_name}"
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setDeleteConfirmService(null)}
                disabled={deleteLoading}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={confirmDelete}
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

export default ServiceListAdmin;
