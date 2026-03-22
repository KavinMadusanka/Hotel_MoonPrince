import React, { useState } from "react";
import toast from "react-hot-toast";
import { addBillingItemType } from "../../../apiService/PaymentService";
import { PlusCircle } from "lucide-react";

const AddBillingItemModal = ({ isOpen, onClose, onAdd }) => {
  const [item, setItem] = useState({
    ItemType: "",
    Description: "",
    UnitPrice: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
        if (!item.ItemType || !item.Description || !item.UnitPrice) {
        toast.error("All fields are required");
        return;
        }

        const res = await addBillingItemType(item);

        if (res.data.success) {
        const createdItem = res.data.data;

        onAdd(createdItem);

        toast.success("Item added successfully");

        setItem({
            ItemType: "",
            Description: "",
            UnitPrice: "",
        });

        onClose();

        } else {
            toast.error(res.data.message);
        }

    } catch (error) {
        toast.error(error.response?.data?.message);
    }
    };

  return (
    <div className="fixed inset-0 bg-white/70 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">

        <h2 className="text-xl font-bold text-purple-800 mb-4">
          Add Billing Item
        </h2>

        {/* Item Type */}
        <div className="mb-3">
          <label className="text-sm font-medium text-black">Item Type</label>
          <input
            type="text"
            className="w-full border p-2 rounded mt-1 text-black"
            value={item.ItemType}
            onChange={(e) =>
              setItem({ ...item, ItemType: e.target.value })
            }
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="text-sm font-medium text-black">Description</label>
          <input
            type="text"
            className="w-full border p-2 rounded mt-1 text-black"
            value={item.Description}
            onChange={(e) =>
              setItem({ ...item, Description: e.target.value })
            }
          />
        </div>

        {/* Unit Price */}
        <div className="mb-4">
          <label className="text-sm font-medium text-black">Unit Price</label>
          <input
            type="number"
            className="w-full border p-2 rounded mt-1 text-black"
            value={item.UnitPrice}
            onChange={(e) =>
              setItem({ ...item, UnitPrice: e.target.value })
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white! rounded bg-red-500! hover:bg-red-700! border-red-700!"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white rounded flex flex-row items-center gap-3"
          >
            <PlusCircle size={20} className="text-white" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBillingItemModal;