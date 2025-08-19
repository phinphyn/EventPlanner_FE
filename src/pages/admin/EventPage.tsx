import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  Calendar,
  Eye,
  MapPin,
  MoreHorizontal,
  // Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/datatable';
import { EventDetailModal } from '@/pages/admin/components/EventDetailModel';
import type { Event, GetEventQueryType } from '@/services/eventService';
import { useEventManagement } from '@/hooks/useEventManagement';
import { toast } from 'react-toastify';
import eventService from '@/services/eventService';
import { formatDateTime } from '@/lib/utils/formatDateTime';

// Mock data for demonstration
// const mockEvents: Event[] = [
//   {
//     event_id: '1',
//     event_name: 'Hội nghị Công nghệ 2024',
//     description:
//       'Hội nghị công nghệ thường niên giới thiệu những đổi mới mới nhất',
//     account_id: 'acc_001',
//     status: 'PENDING',
//     event_date: '2024-03-15',
//     start_time: '09:00',
//     end_time: '17:00',
//     estimated_cost: '50000000',
//     room_service_fee: '5000000',
//     final_cost: null,
//     room_id: 'room_001',
//     event_type_id: 'type_001',
//     account: {
//       account_id: 1,
//       account_name: 'Nguyễn Văn A',
//       email: 'nguyenvana@techcorp.com',
//       phone: '0123456789',
//     },
//     room: {
//       room_id: 1,
//       room_name: 'Hội trường A',
//       guest_capacity: 500,
//       is_active: true,
//     },
//     event_type: {
//       type_id: 1,
//       type_name: 'Hội nghị',
//       description: 'Sự kiện hội nghị chuyên nghiệp',
//     },
//     eventServicesCount: 3,
//     date_create: '2024-01-15T10:00:00Z',
//     updated_at: '2024-01-20T14:30:00Z',
//   },
//   {
//     event_id: '1',
//     event_name: 'Hội nghị Công nghệ 2024',
//     description:
//       'Hội nghị công nghệ thường niên giới thiệu những đổi mới mới nhất',
//     account_id: 'acc_001',
//     status: 'PENDING',
//     event_date: '2024-03-15',
//     start_time: '09:00',
//     end_time: '17:00',
//     estimated_cost: '50000000',
//     room_service_fee: '5000000',
//     final_cost: null,
//     room_id: 'room_001',
//     event_type_id: 'type_001',
//     account: {
//       account_id: 1,
//       account_name: 'Nguyễn Văn A',
//       email: 'nguyenvana@techcorp.com',
//       phone: '0123456789',
//     },
//     room: {
//       room_id: 1,
//       room_name: 'Hội trường A',
//       guest_capacity: 500,
//       is_active: true,
//     },
//     event_type: {
//       type_id: 1,
//       type_name: 'Hội nghị',
//       description: 'Sự kiện hội nghị chuyên nghiệp',
//     },
//     eventServicesCount: 3,
//     date_create: '2024-01-15T10:00:00Z',
//     updated_at: '2024-01-20T14:30:00Z',
//   },
//   {
//     event_id: '1',
//     event_name: 'Hội nghị Công nghệ 2024',
//     description:
//       'Hội nghị công nghệ thường niên giới thiệu những đổi mới mới nhất',
//     account_id: 'acc_001',
//     status: 'PENDING',
//     event_date: '2024-03-15',
//     start_time: '09:00',
//     end_time: '17:00',
//     estimated_cost: '50000000',
//     room_service_fee: '5000000',
//     final_cost: null,
//     room_id: 'room_001',
//     event_type_id: 'type_001',
//     account: {
//       account_id: 1,
//       account_name: 'Nguyễn Văn A',
//       email: 'nguyenvana@techcorp.com',
//       phone: '0123456789',
//     },
//     room: {
//       room_id: 1,
//       room_name: 'Hội trường A',
//       guest_capacity: 500,
//       is_active: true,
//     },
//     event_type: {
//       type_id: 1,
//       type_name: 'Hội nghị',
//       description: 'Sự kiện hội nghị chuyên nghiệp',
//     },
//     eventServicesCount: 3,
//     date_create: '2024-01-15T10:00:00Z',
//     updated_at: '2024-01-20T14:30:00Z',
//   },
// ];

const getStatusBadge = (status: string) => {
  const variants: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    CONFIRMED: 'bg-orange-200 text-orange-900 hover:bg-orange-300',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    CANCELLED: 'bg-red-100 text-red-800 hover:bg-red-200',
    COMPLETED: 'bg-green-100 text-green-800 hover:bg-green-200',
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Chờ duyệt',
    CONFIRMED: 'Đã xác nhận',
    IN_PROGRESS: 'Đang tiến hành',
    CANCELLED: 'Đã hủy',
    COMPLETED: 'Hoàn thành',
  };

  return (
    <Badge
      variant="secondary"
      className={variants[status] || 'bg-gray-100 text-gray-800'}
    >
      {statusLabels[status] || status}
    </Badge>
  );
};

export default function AdminEventsPage() {
  const [eventList, setEventList] = React.useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const {
    events,
    // setEvents,
    // isLoading,
    selectedEvents,
    setSelectedEvents,
    updateEventStatus,
    getEventStats,
  } = useEventManagement(eventList);

  const stats = getEventStats();

  const columns: ColumnDef<Event>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              setSelectedEvents(
                table
                  .getRowModel()
                  .rows.map((row) => String(row.original.event_id)),
              );
            } else {
              setSelectedEvents([]);
            }
          }}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedEvents.includes(String(row.original.event_id))}
          onCheckedChange={(value) => {
            if (value) {
              setSelectedEvents((prev) => [
                ...prev,
                String(row.original.event_id),
              ]);
            } else {
              setSelectedEvents((prev) =>
                prev.filter((id) => id !== String(row.original.event_id)),
              );
            }
          }}
          aria-label="Chọn hàng"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'event_name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            Tên Sự kiện
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="space-y-1 max-w-[180px]">
            <div className="font-medium">{event.event_name}</div>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {event.description}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'event_date',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Ngày & Giờ
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const event = row.original;
        const date = new Date(event.event_date);
        return (
          <div className="space-y-1">
            <div className="font-medium">
              {date.toLocaleDateString('vi-VN')}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDateTime(new Date(event.start_time))} -{' '}
              {formatDateTime(new Date(event.end_time))}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'room',
      header: 'Phòng',
      cell: ({ row }) => {
        const room = row.original.room;
        return (
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">
                {room?.room_name || 'Chưa xác định'}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'estimated_cost',
      header: 'Chi phí',
      cell: ({ row }) => {
        const event = row.original;
        const estimatedCost = Number.parseInt(event.estimated_cost) || 0;
        const finalCost = event.final_cost
          ? Number.parseInt(event.final_cost)
          : null;

        return (
          <div className="space-y-1">
            <div className="font-medium">
              {finalCost
                ? `${finalCost.toLocaleString('vi-VN')} ₫`
                : `${estimatedCost.toLocaleString('vi-VN')} ₫`}
            </div>
            <div className="text-sm text-muted-foreground">
              {finalCost ? 'Cuối cùng' : 'Ước tính'}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => getStatusBadge(row.getValue('status')),
    },
    {
      accessorKey: 'account',
      header: 'Người tổ chức',
      cell: ({ row }) => {
        const account = row.original.account;
        return (
          <div>
            <div className="font-medium">
              {account?.account_name || 'Chưa xác định'}
            </div>
            {account?.email && (
              <div className="text-sm text-muted-foreground">
                {account.email}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedEvent(event)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem Chi tiết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleGetEvents = async () => {
    try {
      const queries: GetEventQueryType = {
        includeAccount: true,
        includeRoom: true,
        includeEventType: true,
        includeEventServices: true,
        sortBy: 'date_create',
        sortOrder: 'desc',
      };

      const response = await eventService.getAllEvents(queries);

      setEventList(response.data);
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : 'Lỗi khi lấy dữ liệu sự kiện',
      );
    }
  };

  const handleConfirmEvent = (eventId: string | number) => {
    updateEventStatus({ eventId, status: 'CONFIRMED' });
    handleGetEvents();
  };

  React.useEffect(() => {
    handleGetEvents();
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Sự kiện</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tất cả sự kiện trong hệ thống của bạn
          </p>
        </div>
        {/* <Button>Tạo Sự kiện Mới</Button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Sự kiện</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tất cả sự kiện</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800"
            >
              {stats.PENDING}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.PENDING}</div>
            <p className="text-xs text-muted-foreground">Đang chờ xác nhận</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác nhận</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {stats.CONFIRMED}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.CONFIRMED}</div>
            <p className="text-xs text-muted-foreground">Sẵn sàng diễn ra</p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Người tham gia
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendees}</div>
            <p className="text-xs text-muted-foreground">Trên tất cả sự kiện</p>
          </CardContent>
        </Card> */}
      </div>

      {/* Bulk Actions Toolbar */}
      {/* <BulkActionsToolbar
        selectedCount={selectedEvents.length}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onClearSelection={() => setSelectedEvents([])}
        isLoading={isLoading}
      /> */}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Sự kiện</CardTitle>
          <CardDescription>
            Danh sách toàn diện tất cả sự kiện với trạng thái hiện tại và chi
            tiết
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={events}
            searchKey="event_name"
            searchPlaceholder="Tìm kiếm sự kiện..."
          />
        </CardContent>
      </Card>

      <EventDetailModal
        event={selectedEvent}
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
        onStatusUpdate={updateEventStatus}
        onConfirmEvent={handleConfirmEvent}
      />
    </div>
  );
}
