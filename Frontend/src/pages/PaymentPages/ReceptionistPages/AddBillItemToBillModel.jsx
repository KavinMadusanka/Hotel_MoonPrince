import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";
import { addBillToReservation, getBillingItems } from "../../../apiService/PaymentService";

const AddBillItemToBillModal = ({ isOpen, onClose, onAdd, bill, reservation }) => {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const [form, setForm] = useState({
    ItemType: "",
    Description: "",
    QTY: 1,
    UnitPrice: "",
  });

  // 🔥 Load item types from DB
  useEffect(() => {
    if (!isOpen) return;

    const loadItems = async () => {
        try {
        const res = await getBillingItems();
        setItems(res.data.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load items");
        }
    };

    loadItems();

    }, [isOpen]);


  if (!isOpen) return null;

  // 🔥 when select dropdown
  const handleSelect = (id) => {
    setSelectedId(id);

    const selected = items.find((item) => item._id === id);

    setForm({
      ItemType: selected.ItemType,
      Description: selected.Description,
      QTY: 1,
      UnitPrice: selected.UnitPrice,
    });
  };

  // 🔥 submit
  const handleSubmit = async () => {
    if (!selectedId) {
      toast.error("Please select item");
      return;
    }

    if (form.QTY <= 0) {
      toast.error("Invalid QTY");
      return;
    }

    const newItem = await addBillToReservation( bill._id ,form);
    console.log(newItem.data.data.billingItems);
    onAdd(reservation);

    // reset
    setForm({
      ItemType: "",
      Description: "",
      QTY: 1,
      UnitPrice: "",
    });

    setSelectedId("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white/70 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">

        <h2 className="text-xl font-bold text-purple-800 mb-4">
          Add Item to Bill
        </h2>

        {/* 🔽 Dropdown */}
        <div className="mb-3">
          <label className="text-black text-sm font-medium">
            Select Item
          </label>

          <select
            className="w-full border p-2 rounded mt-1 text-black"
            value={selectedId}
            onChange={(e) => handleSelect(e.target.value)}
          >
            <option value="">-- Select Item --</option>

            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.Description} - Rs.{item.UnitPrice}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="text-black text-sm">Description</label>
          <input
            type="text"
            value={form.Description}
            readOnly
            className="w-full border p-2 rounded mt-1 text-black bg-gray-100"
          />
        </div>

        {/* QTY */}
        <div className="mb-3">
          <label className="text-black text-sm">QTY</label>
          <input
            type="number"
            value={form.QTY}
            onChange={(e) =>
              setForm({ ...form, QTY: Number(e.target.value) })
            }
            className="w-full border p-2 rounded mt-1 text-black"
          />
        </div>

        {/* Unit Price */}
        <div className="mb-4">
          <label className="text-black text-sm">Unit Price</label>
          <input
            type="number"
            value={form.UnitPrice}
            readOnly
            className="w-full border p-2 rounded mt-1 text-black bg-gray-100"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-700 text-white flex items-center gap-2 rounded"
          >
            <PlusCircle size={18} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBillItemToBillModal;