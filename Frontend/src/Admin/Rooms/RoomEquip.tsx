import { useQuery } from "@apollo/client/react";
import type { GetEquipment_Interface } from "../../graphql/Client";
import { GetEquipment_Query } from "../../graphql/Query";
import type { RoomInterface } from "./RoomTable";
interface Props {
  room: RoomInterface;
  onClose: () => void;
  handleRemoveEqu: (equipment: { id: string; name: string }) => void;
  handleAddEquip:(equipment:{id:string;name:string})=>void
}

export default function RoomEquip({ room, onClose, handleRemoveEqu, handleAddEquip }: Props) {
  const { data } = useQuery<GetEquipment_Interface>(GetEquipment_Query);
  const eqips = data?.GetEquipments ?? [];
  const availEqups = eqips.filter(
    (eqip) => !room.equipments.some((asigneq) => asigneq.id === eqip.id)
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Equipment
            </h3>
            <p className="mt-1 text-sm text-gray-500">{room.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            x
          </button>
        </div>
        <div className="p-5">
          <h4 className="mb-3 text-sm font-semibold text-gray-700">
            Current Equipment
          </h4>
          {room.equipments.length === 0 ? (
            <p className="text-sm text-gray-500">
              No equipment assigned to this room.
            </p>
          ) : (
            <div className="space-y-2">
              {room.equipments.map((equipment) => (
                <div
                  key={equipment.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {equipment.name}
                  </span>
                  <button
                    type="button"
                    className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                    onClick={() => handleRemoveEqu(equipment)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-end border-t p-5">
          {" "}
          <h4 className="mb-3 text-sm font-semibold text-gray-700">
            Add Equipment
          </h4>
          <div className="space-y-2">
            {availEqups.map((eq) => (
              <div
                key={eq.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <span className="text-sm font-medium text-gray-900">
                  {eq.name}
                </span>
                <button
                  type="button"
                  className="rounded bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                  onClick={() => handleAddEquip(eq)}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end border-t p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
