import type { GetEquipment_Interface } from "../../graphql/Client";

interface Props {
  equipments: GetEquipment_Interface["GetEquipments"];
  onEdit: (
    equipment: GetEquipment_Interface["GetEquipments"][number]
  ) => void;
}
export default function EquipmentTable({
  equipments,
  onEdit,
}: Props) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                ID
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Equipment Name
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {equipments.map((eq, idx) => (
              <tr
                key={eq.id}
                className="border-b last:border-b-0"
              >
                <td className="px-6 py-4 text-sm text-gray-600">
                  {idx + 1}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {eq.name}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(eq)}
                      className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
                    >
                      EDIT
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
