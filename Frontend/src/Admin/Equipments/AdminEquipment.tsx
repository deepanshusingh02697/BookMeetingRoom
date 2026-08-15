import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import { GetEquipment_Query } from "../../graphql/Query";
import { createEquipment_Mutation } from "../../graphql/Mutation";

import type {
  CreateEquipment_Interface,
  GetEquipment_Interface,
} from "../../graphql/Client";
import EquipmentTable from "./EuqipmentTable";
import EquipmentForm from "./EquipmentForm";

export default function AdminEquipment() {
  const [showForm, setShowForm] = useState(false);
  const { data, loading, error, refetch } =
    useQuery<GetEquipment_Interface>(GetEquipment_Query);
  const [createEquipment, { loading: creating }] =
    useMutation<CreateEquipment_Interface>(
      createEquipment_Mutation,
    )
  const equipments = data?.GetEquipments ?? [];
  const handleSubmit = async (form: { name: string }) => {
    try {
      await createEquipment({
        variables: form,
      });
      await refetch();
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };
  if (loading) {
    return (
      <div className="p-5 text-sm text-gray-500">
        Loading equipment...
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-5">
        <p className="font-medium text-red-700">
          Failed to load equipment
        </p>
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Equipment
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage meeting room equipment.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-md bg-[#18216B] px-4 py-2 text-sm font-medium text-white"
        >
          <FiPlus />
          Add Equipment
        </button>
      </div>
      <EquipmentTable equipments={equipments} />
      {showForm && (
        <EquipmentForm
          loading={creating}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}