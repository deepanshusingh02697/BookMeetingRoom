import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { FiPlus } from "react-icons/fi";
import RoomTable, { type RoomInterface } from "./RoomTable";
import RoomForm from "./RoomForm";
import { GetRooms_Query } from "../../graphql/Query";
import {
  addEquipmentToRoom_Mutation,
  createRoom_Mutation,
  disableRoom_Mutation,
  enableRoom_Mutation,
  removeEquipmentFromRoom_Mutation,
  updateRoom_Mutation,
} from "../../graphql/Mutation";
import type {
  AddEquToRoom_Interface,
  CreateRoom_Interface,
  DisableRoom_Interface,
  EnableRoom_Interface,
  GetRooms_Interface,
  RemoveEquromRoom_Interface,
  UpdateRoom_Interface,
} from "../../graphql/Client";
import RoomEquip from "./RoomEquip";
import RoomMaint from "./RoomMaint";
import { toast } from "react-toastify";
import Loader from "../../Component/Loader";

export default function AdminRooms() {
  const [showForm, setShowForm] = useState(false);
  const [editRoom, setEditRoom] = useState<RoomInterface | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomInterface | null>(null);
  const [selectedMainRoom, setSelectedMainRoom] =
    useState<RoomInterface | null>(null);

  const { data, loading, error, refetch } =
    useQuery<GetRooms_Interface>(GetRooms_Query);
  const rooms = data?.GetRooms ?? [];
  const [CreateRoom, { loading: createLoading }] =
    useMutation<CreateRoom_Interface>(createRoom_Mutation);
  const [UpdateRoom, { loading: updateLoading }] =
    useMutation<UpdateRoom_Interface>(updateRoom_Mutation);
  const [DisableRoom] =
    useMutation<DisableRoom_Interface>(disableRoom_Mutation);
  const [EnableRoom] = useMutation<EnableRoom_Interface>(enableRoom_Mutation);

  const [RemoveEquip] = useMutation<RemoveEquromRoom_Interface>(
    removeEquipmentFromRoom_Mutation,
  );
  const [AddEquip] = useMutation<AddEquToRoom_Interface>(
    addEquipmentToRoom_Mutation,
  );

  const handleSubmit = async (form: {
    name: string;
    capacity: number;
    floor: number;
    location: string;
  }) => {
    try {
      if (editRoom) {
        await UpdateRoom({
          variables: {
            id: Number(editRoom.id),
            ...form,
          },
        });
      } else {
        await CreateRoom({
          variables: form,
        });
      }
      await refetch();
      setShowForm(false);
      setEditRoom(null);
    } catch (error) {
      const err = error instanceof Error;
      if (err) {
        toast(error.message || "Fields required correctly", {
          type: "error",
          theme: "colored",
        });
        return;
      } else {
        toast("Something wrong, try again", {
          position: "top-right",
          type: "error",
          theme: "colored",
        });
        return;
      }
    }
  };
  const handleEdit = (room: RoomInterface) => {
    setEditRoom(room);
    setShowForm(true);
  };

  const handleStatusChange = async (room: RoomInterface) => {
    try {
      if (room.status === "AVAILABLE") {
        await DisableRoom({
          variables: {
            id: Number(room.id),
          },
        });
      } else {
        await EnableRoom({
          variables: {
            id: Number(room.id),
          },
        });
      }
      await refetch();
    } catch (error) {
      const err= error instanceof Error
      if(err){
        toast(error.message,{
          theme:"colored",
          type:"error",
        })
      }else{
        toast("Faild to status change",{
          theme:"colored",
          type:"error",
        })
      }
    }
  };
  const handleManageEquip = async (room: RoomInterface) => {
    setSelectedRoom(room);
  };
  const handlManageMain = async (room: RoomInterface) => {
    setSelectedMainRoom(room);
  };
  const handleRemoveEquip = async (eqip: { id: string; name: string }) => {
    if (!selectedRoom) return;
    try {
      await RemoveEquip({
        variables: {
          roomId: Number(selectedRoom.id),
          equipmentId: Number(eqip.id),
        },
      });
      const res = await refetch();
      const updatedRoom = res.data?.GetRooms.find(
        (room) => room.id === selectedRoom.id,
      );
      if (updatedRoom) {
        setSelectedRoom(updatedRoom);
      }
    } catch (error) {
      const err= error instanceof Error
      if(err){
        toast(error.message,{
          theme:"colored",
          type:"error",
        })
      }else{
        toast("Faild to remove equipment",{
          theme:"colored",
          type:"error",
        })
      }
    }
  };
  const handleAddEquipment = async (eqip: { id: string; name: string }) => {
    if (!selectedRoom) return;
    try {
      await AddEquip({
        variables: {
          roomId: Number(selectedRoom.id),
          equipmentId: Number(eqip.id),
        },
      });
      const res = await refetch();
      const udpateRoom = res.data?.GetRooms.find(
        (room) => room.id === selectedRoom.id,
      );
      if (udpateRoom) {
        setSelectedRoom(udpateRoom);
      }
    } catch (error) {
      const err= error instanceof Error
      if(err){
        toast(error.message,{
          theme:"colored",
          type:"error",
        })
      }else{
        toast("Faild to add equipment",{
          theme:"colored",
          type:"error",
        })
      }
    }
  };
  if (loading) {
    return <Loader/>
  }
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-5">
        <p className="font-medium text-red-700">Failed to load rooms</p>
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rooms</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage meeting rooms and their availability.
          </p>
        </div>
        <button
          onClick={() => {
            setEditRoom(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-md bg-[#18216B] px-4 py-2 text-sm font-medium text-white"
        >
          <FiPlus />
          Add Room
        </button>
      </div>
      <RoomTable
        rooms={rooms}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onManageEquip={handleManageEquip}
        onManageMaint={handlManageMain}
      />
      {showForm && (
        <RoomForm
          key={editRoom?.id ?? "new"}
          room={editRoom}
          loading={createLoading || updateLoading}
          onClose={() => {
            setShowForm(false);
            setEditRoom(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
      {selectedRoom && (
        <RoomEquip
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          handleRemoveEqu={handleRemoveEquip}
          handleAddEquip={handleAddEquipment}
        />
      )}
      {selectedMainRoom && (
        <RoomMaint
          room={selectedMainRoom}
          onClose={() => setSelectedMainRoom(null)}
        />
      )}
    </div>
  );
}
