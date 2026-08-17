import { useState } from "react";
import type { GetEquipment_Interface } from "../../graphql/Client";

type EquipType = GetEquipment_Interface["GetEquipments"][number];

interface EquipmentFormProps {
  equipment: EquipType | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (form: {
    name: string;
  }) => void;
}

export default function EquipmentForm({
  equipment,
  loading,
  onClose,
  onSubmit,
}: EquipmentFormProps) {
  const [equipmentName, setEquipmentName] = useState(
    equipment?.name ?? ""
  );

  const isEditing = equipment !== null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      name: equipmentName.trim(),
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
            {isEditing ? "Edit Equipment" : "Add Equipment"}
          </h3>
        </div>

        <div className="p-5">
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Equipment Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={equipmentName}
            onChange={(event) =>
              setEquipmentName(event.target.value)
            }
            placeholder="Projector"
            required
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#18216B]"
          />
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
            {loading
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
                ? "Update Equipment"
                : "Add Equipment"}
          </button>
        </div>
      </form>
    </div>
  );
}
