import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import type { RoomInterface } from "./RoomTable";
import type {
  CreateMaint_Interface,
  DeleteMain_Interface,
  RoomMaintinance_Interface,
} from "../../graphql/Client";
import { roomMaintenance_Query } from "../../graphql/Query";
import {
  createMaintenance_Mutation,
  deleteMaintenance_Mutation,
} from "../../graphql/Mutation";
import { toast } from "react-toastify";

interface Props {
  room: RoomInterface;
  onClose: () => void;
}
export default function RoomMaint({ room, onClose }: Props) {
  const [showForm, setShowForm] = useState(false);
  const { data, loading, error, refetch } = useQuery<RoomMaintinance_Interface>(
    roomMaintenance_Query,
    {
      variables: {
        roomId: Number(room.id),
      },
    },
  );
  const [CreateMaint, { loading: createLoading }] =
    useMutation<CreateMaint_Interface>(createMaintenance_Mutation);
  const [DeleteMain] = useMutation<DeleteMain_Interface>(
    deleteMaintenance_Mutation,
  );
  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
    reason: "",
  });
  const maintenances = data?.RoomMaintinance ?? [];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      alert("End time can't be greater than start time");
      return;
    }
    try {
      await CreateMaint({
        variables: {
          roomId: Number(room.id),
          startTime: form.startTime,
          endTime: form.endTime,
          reason: form.reason || null,
        },
      });

      await refetch();

      setForm({
        startTime: "",
        endTime: "",
        reason: "",
      });

      setShowForm(false);
    } catch (error) {
      const err= error instanceof Error
      if(err){
        toast(error.message,{
          theme:"colored",
          type:"error",
        })
      }else{
        toast("Faild to submit",{
          theme:"colored",
          type:"error",
        })
      }
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await DeleteMain({
        variables: {
          id: Number(id),
        },
      });
      await refetch();
    } catch (error) {
      const err= error instanceof Error
      if(err){
        toast(error.message,{
          theme:"colored",
          type:"error",
        })
      }else{
        toast("Faild to delete",{
          theme:"colored",
          type:"error",
        })
      }
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Maintenance</h3>
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
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">
              Maintenance Records
            </h4>
            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className="rounded-md bg-[#18216B] px-3 py-2 text-xs font-medium text-white"
            >
              {showForm ? "Cancel" : "Add Maintenance"}
            </button>
          </div>
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-5 space-y-4 rounded-md border bg-gray-50 p-4"
            >
              <div>
                <label
                  htmlFor="startTime"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>

                <input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#18216B]"
                />
              </div>

              <div>
                <label
                  htmlFor="endTime"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>

                <input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#18216B]"
                />
              </div>

              <div>
                <label
                  htmlFor="reason"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Reason
                </label>

                <input
                  id="reason"
                  name="reason"
                  type="text"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="AC Repair"
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#18216B]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="rounded-md bg-[#18216B] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createLoading ? "Saving..." : "Add Maintenance"}
                </button>
              </div>
            </form>
          )}
          {loading && (
            <p className="text-sm text-gray-500">Loading maintenance...</p>
          )}
          {error && (
            <p className="text-sm text-red-600">Failed to load maintenance</p>
          )}
          {maintenances.length === 0 && (
            <p className="rounded-md border p-4 text-center text-sm text-gray-500">
              No maintenance records for this room
            </p>
          )}
          {maintenances.length > 0 && (
            <div className="space-y-2">
              {maintenances.map((main) => (
                <div key={main.id} className="rounded-md border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {main.reason || "Maintenance"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Start:{" "}
                        {new Date(Number(main.startTime)).toLocaleString(
                          "en-IN",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        End:{" "}
                        {new Date(Number(main.endTime)).toLocaleString(
                          "en-IN",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(main.id)}
                      className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
