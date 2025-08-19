import { Check, X, Clock, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/services/eventService';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onBulkStatusUpdate: (status: Event['status']) => void;
  onClearSelection: () => void;
  isLoading?: boolean;
}

export function BulkActionsToolbar({
  selectedCount,
  onBulkStatusUpdate,
  onClearSelection,
  isLoading = false,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {selectedCount} đã chọn
        </Badge>
        <span className="text-sm text-muted-foreground">
          {selectedCount === 1 ? 'sự kiện' : 'sự kiện'} đã chọn
        </span>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={isLoading}>
              {isLoading ? 'Đang cập nhật...' : 'Hành động Hàng loạt'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thay đổi Trạng thái</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onBulkStatusUpdate('confirmed')}>
              <Check className="mr-2 h-4 w-4 text-green-600" />
              Xác nhận Sự kiện
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBulkStatusUpdate('pending')}>
              <Clock className="mr-2 h-4 w-4 text-yellow-600" />
              Đặt thành Chờ duyệt
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBulkStatusUpdate('cancelled')}>
              <X className="mr-2 h-4 w-4 text-red-600" />
              Hủy Sự kiện
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBulkStatusUpdate('completed')}>
              <Calendar className="mr-2 h-4 w-4 text-blue-600" />
              Đánh dấu Hoàn thành
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Xóa Lựa chọn
        </Button>
      </div>
    </div>
  );
}
