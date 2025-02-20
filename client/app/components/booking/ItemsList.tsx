import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import Input from "../custom/Input";
import Dropdown from "../custom/Dropdown";

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
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const toggleService = (service: string) => {
    setNewItem((prev) => {
      const updatedServices = prev.additionalServices.includes(service)
        ? prev.additionalServices.filter((s) => s !== service)
        : [...prev.additionalServices, service];
      return { ...prev, additionalServices: updatedServices };
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Items</h3>

      {/* Input Fields for New Item */}
      <div className="flex flex-col gap-2 items-center border p-4 rounded shadow-sm">
        <div className="flex items-center justify-start gap-2 w-full">
          <Input
            name="newItem.name"
            placeholder="Item Name"
            register={register}
            value={newItem.name}
            onChange={(value) => setNewItem({ ...newItem, name: value })}
            className="w-full"
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
        </div>
        <div className="flex items-center justify-start gap-2 w-full">
          <Input
            name="newItem.specialInstructions"
            placeholder="Special Instructions"
            register={register}
            value={newItem.specialInstructions}
            onChange={(value) =>
              setNewItem({ ...newItem, specialInstructions: value })
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

        {/* Additional Services */}
        <div className="w-full flex flex-wrap gap-2 mt-2">
          {availableServices.map((service) => (
            <button
              key={service}
              type="button"
              onClick={() => toggleService(service)}
              className={`px-[12px] py-[8px] font-medium rounded-md text-sm border ${
                newItem.additionalServices.includes(service)
                  ? "bg-primary text-white"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              {service}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="text-primary gap-2 flex items-center mt-2"
        >
          Add
          <PlusCircle size={20} />
        </button>
      </div>

      {items.length > 0 && (
        <div className="mt-4 border rounded-md">
          <table className="w-full ">
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
