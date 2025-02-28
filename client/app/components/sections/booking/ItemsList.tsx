import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import Input from "../../atoms/Input";
import Dropdown from "../../molecules/Dropdown";

const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ItemsList = ({
  items,
  setItems,
  register,
}: {
  items: any[];
  setItems: any;
  register: any;
  control: any;
}) => {
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    isFragile: false,
    specialInstructions: "",
    additionalServices: [],
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const availableServices = [
    "Carpentry",
    "Blacksmithing",
    "Electrical",
    "Plumbing",
    "Painting",
    "Cleaning",
  ];

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;

    setItems([...items, newItem]);

    setNewItem({
      name: "",
      quantity: 1,
      isFragile: false,
      specialInstructions: "",
      additionalServices: [],
    });
    setIsDialogOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => setIsDialogOpen(true)}
        className="text-primary flex items-center gap-2"
      >
        Add Item
        <PlusCircle size={20} />
      </button>
      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
        <div className="flex flex-col gap-2">
          <Input
            name="newItem.name"
            placeholder="Item Name"
            register={register}
            value={newItem.name}
            onChange={(value) => setNewItem({ ...newItem, name: value })}
          />
          <Input
            name="newItem.quantity"
            type="number"
            placeholder="Item Quantity"
            register={register}
            value={newItem.quantity}
            onChange={(value) =>
              setNewItem({ ...newItem, quantity: Number(value) })
            }
          />
          <Dropdown
            options={["Yes", "No"]}
            label="Fragile"
            value={newItem.isFragile ? "Yes" : "No"}
            onSelect={(selected) =>
              setNewItem({ ...newItem, isFragile: selected === "Yes" })
            }
            onClear={() => setNewItem({ ...newItem, isFragile: false })}
          />
        </div>
        <button
          onClick={handleAddItem}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </Dialog>
      {items.length > 0 && (
        <div className="mt-4 border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="bg-green-400/20 text-left">
                <th className="p-2 font-semibold">Item</th>
                <th className="p-2 font-semibold">Qty</th>
                <th className="p-2 font-semibold">Fragile</th>
                <th className="p-2 font-semibold">Instructions</th>
                <th className="p-2 font-semibold">Services</th>
                <th className="p-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{item.isFragile ? "Yes" : "No"}</td>
                  <td className="p-2">{item.specialInstructions || "-"}</td>
                  <td className="p-2">
                    {item.additionalServices.length > 0
                      ? item.additionalServices.join(", ")
                      : "-"}
                  </td>
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ItemsList;
