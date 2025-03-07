import { useState } from "react";
import { updateItems, updateStep } from "@/app/store/slices/BookingSlice";
import { useAppDispatch } from "@/app/store/hooks";
import Input from "@/app/components/atoms/Input";
import Dropdown from "@/app/components/molecules/Dropdown";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";

const ItemsStep = () => {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState([]);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      itemName: "",
      quantity: "",
      fragile: "No",
      pickupFloorNumber: "",
      dropoffFloorNumber: "",
      specialInstructions: "",
    },
  });

  const onSubmit = (data) => {
    const newItem = {
      name: data.itemName,
      quantity: data.quantity,
      fragile: data.fragile,
    };

    addItem(newItem);

    reset({
      ...data,
      itemName: "",
      quantity: "",
      fragile: "No",
    });
  };

  const addItem = (newItem) => {
    setItems([...items, newItem]);
  };

  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, updatedItem) => {
    setItems(items.map((item, i) => (i === index ? updatedItem : item)));
  };
  const handleNext = () => {
    dispatch(updateItems(items));
    dispatch(updateStep(2));
  };

  return (
    <main className="flex items-start justify-between pt-[2rem] pb-[20%]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2 w-[45%]"
      >
        <Input
          name="pickupFloorNumber"
          type="number"
          placeholder="Pick-up Floor Number"
          register={register}
        />
        <Input
          name="dropoffFloorNumber"
          placeholder="Drop-off Floor Number"
          register={register}
        />
        <Input name="itemName" placeholder="Item Name" register={register} />
        <Input name="quantity" placeholder="Quantity" register={register} />

        <div className="flex flex-col items-center justify-start gap-6">
          <Dropdown
            label="Fragile"
            options={["Yes", "No"]}
            onSelect={() => {}}
            onClear={() => {}}
            {...register("fragile")}
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2"
          >
            Add Item
            <PlusCircle />
          </button>
        </div>
        <Input
          name="specialInstructions"
          placeholder="Special Instructions"
          register={register}
          className="pb-[70px] text-[16px] truncate"
        />
      </form>

      {/* Items Table */}
      <div className="w-[45%]">
        <h2 className="text-xl font-semibold text-center mb-4">
          Items Summary
        </h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2">Item</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Fragile</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={index} className="border-none">
                  <td className="py-2">{item.name || "N/A"}</td>
                  <td className="py-2">{item.quantity || "N/A"}</td>
                  <td className="py-2">{item.fragile ? "Yes" : "No"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-2 text-gray-500">
                  No items added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button onClick={handleNext}>Next</button>
    </main>
  );
};

export default ItemsStep;
