import { FiEdit2, FiPower, FiSettings, FiTool } from "react-icons/fi";
export interface RoomInterface {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  location: string;
  status: string;
  equipments: {
    id: string;
    name: string;
  }[];
}
interface Props {
  rooms: RoomInterface[];
  onEdit: (room: RoomInterface) => void;
  onStatusChange: (room: RoomInterface) => void;
  onManageEquip:(room:RoomInterface)=>void;
  onManageMaint:(room:RoomInterface)=>void;
}
export default function RoomTable({ rooms, onEdit, onStatusChange,onManageEquip,onManageMaint}: Props) {
  return (
    <div className="overflow-hidden rounded-md border bg-white shadow-sm">
      {rooms.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-500">
          No rooms found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Room
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Capacity
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Floor
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Location
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr
                  key={room.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{room.name}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {room.capacity}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {room.floor}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {room.location}
                  </td>
                  <td className="px-5 py-4">
                    {room.status === "AVAILABLE" ? (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        AVAILABLE
                      </span>
                    ) : (
                      <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                        DISABLED
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(room)}
                        className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        onClick={() => onStatusChange(room)}
                        className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      >
                        {room.status === "AVAILABLE" ? (
                          <FiPower className="text-green-500" />
                        ) : (
                          <FiPower className="text-red-600" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onManageEquip(room)}
                        className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        title="Manage equipment"
                      >
                        <FiSettings />
                      </button>
                      <button
                        type="button"
                        onClick={() => onManageMaint(room)}
                        className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        title="Manage equipment"
                      >
                        <FiTool />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
