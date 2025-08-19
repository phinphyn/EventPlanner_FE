import RoomCardList from '@/components/client/RoomPage/RoomCardList';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { GetAllRoomQueries, Room } from '@/services/roomService';
import roomService from '@/services/roomService';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const breadcrumbItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Phòng tiệc', href: '/rooms' },
];

const RoomListPage = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleFetchRooms = React.useCallback(async () => {
    setLoading(true);
    try {
      const queries: GetAllRoomQueries = {
        includeEvents: true,
        includeImages: true,
        includeInactive: false,
        page: 1,
        limit: 20,
      };

      const fetchedRooms = await roomService.getAllRooms(queries);
      setRooms(fetchedRooms.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error(
        error instanceof Error ? error.message : 'Internal server error',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleViewRoomDetail = React.useCallback(
    (room: Room) => {
      const roomId = room.room_id;

      navigate(`rooms/${roomId}`);
    },
    [navigate],
  );

  React.useEffect(() => {
    handleFetchRooms();
  }, [handleFetchRooms]);

  return (
    <div className="container p-8">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={index}>
              {item.href === '/rooms' ? (
                <BreadcrumbPage>
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <RoomCardList
        rooms={rooms}
        loading={loading}
        onRoomSelect={handleViewRoomDetail}
        className="pt-8"
      />
    </div>
  );
};

export default RoomListPage;
