import { useState } from "react";
import type { RoomInterface } from "./RoomTable";

type Props = {
  room: RoomInterface | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (form: {
    name: string;
    capacity: number;
    floor: number;
    location: string;
  }) => void;
};
export default function RoomForm({ room, loading, onClose, onSubmit }: Props) {
  const [form, setForm] = useState({
    name: room?.name ?? "",
    capacity: room?.capacity?.toString() ?? "",
    floor: room?.floor?.toString() ?? "",
    location: room?.location ?? "",
  });
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      capacity: Number(form.capacity),
      floor: Number(form.floor),
      location: form.location,
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white shadow-xl"
      >
        <div className="border-b p-5">
          <h3 className="text-lg font-semibold text-gray-900">
            {room ? "Edit Room" : "Add Room"}
          </h3>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Room Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChangeInput}
              placeholder="Arctic Room"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#18216B]"
            />
          </div>
          <div>
            <label
              htmlFor="capacity"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Capacity
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChangeInput}
              placeholder="10"
              min="1"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#18216B]"
            />
          </div>
          <div>
            <label
              htmlFor="floor"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Floor
            </label>
            <input
              id="floor"
              name="floor"
              type="number"
              value={form.floor}
              onChange={handleChangeInput}
              placeholder="2"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#18216B]"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChangeInput}
              placeholder="North Wing"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#18216B]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-[#18216B] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : room ? "Update Room" : "Add Room"}
          </button>
        </div>
      </form>
    </div>
  );
}
