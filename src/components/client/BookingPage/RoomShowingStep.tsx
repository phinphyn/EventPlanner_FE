import React from 'react';
import type { GetAllRoomQueries, Room } from '@/services/roomService';
import roomService from '@/services/roomService';
import RoomCardList from '../RoomPage/RoomCardList';
import useStepForm from '@/hooks/useStepForm';

const RoomShowingStep = () => {
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { updateField } = useStepForm();

  const onChooseRoom = (room: Room) => {
    console.log('Selected room:', room);
    updateField('room_id', room.room_id.toString());
    // Handle room selection logic here
  };

  const fetchRooms = React.useCallback(async () => {
    setLoading(true);
    try {
      const roomQueries: GetAllRoomQueries = {
        includeImages: true,
      };

      const response = await roomService.getAllRooms(roomQueries);

      setRooms(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div>
      <h1 className="text-3xl text-primary font-bold mb-8">
        Chọn một phòng cho buổi tiệc
      </h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <h1 className="text-2xl text-primary">Loading...</h1>
        </div>
      ) : (
        <RoomCardList
          rooms={rooms}
          onRoomSelect={(room) => console.log(room)}
          onChoose={onChooseRoom}
        />
      )}
    </div>
  );
};

export default RoomShowingStep;
