import type { GetEquipment_Interface } from "../../graphql/Client";
interface Props {
  equipments: GetEquipment_Interface["GetEquipments"];
}
export default function EquipmentTable({
  equipments
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
            {equipments.map((equipment, index) => (
              <tr
                key={equipment.id}
                className="border-b last:border-b-0"
              >
                <td className="px-6 py-4 text-sm text-gray-600">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {equipment.name}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      className="rounded p-1 text-gray-500 hover:bg-gray-100"
                    >
                      <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        EDIT
                      </span>
                    </button>
                    <button
                      type="button"
                      className="rounded p-1 text-gray-500 hover:bg-gray-100"
                    >
                      <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                        DELETE
                      </span>
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