"use client";
import { useState } from "react";
import { updateItems, updateStep } from "@/app/store/slices/BookingSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Input from "@/app/components/atoms/Input";
import Dropdown from "@/app/components/molecules/Dropdown";
import { PlusCircle, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import CheckBox from "@/app/components/atoms/CheckBox";
import categoryOptions from "@/app/constants/categoryOptions";
import { useUpdateOnboardingStepMutation } from "@/app/store/apis/BookingApi";

interface ItemProps {
  name: string;
  quantity: string;
  fragile: boolean;
  category: string;
  additionalService: string;
  specialInstructions: string;
}

const ItemsStep = () => {
  const { step } = useAppSelector((state) => state.booking);
  const [updateOnboardingStep, { data, error }] =
    useUpdateOnboardingStepMutation();
  const dispatch = useAppDispatch();
  const [items, setItems] = useState([]);

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      itemName: "",
      quantity: "",
      fragile: "No",
      category: "",
      additionalService: "",
      specialInstructions: "",
    },
  });

  const onSubmit = (data) => {
    const newItem = {
      name: data.itemName,
      quantity: data.quantity,
      fragile: data.fragile,
      specialInstructions: data.specialInstructions,
    };
    setItems([...items, newItem]);

    try {
      const res = await updateOnboardingStep({
        step: "items",
        data: {
          items,
        },
      });

      dispatch(updateStep(step + 1));

      reset({
        itemName: "",
        quantity: "",
        fragile: "No",
        specialInstructions: "",
      });
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    dispatch(updateStep(step - 1));
  };

  return (
    <OnboardingLayout currentStep={step}>
      <h1 className="text-[30px] font-semibold tracking-wide">
        What are you moving?
      </h1>
      <div className="flex items-center justify-between w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-2 w-[45%]"
        >
          <Input name="itemName" placeholder="Item Name" register={register} />
          <Input name="quantity" placeholder="Quantity" register={register} />

          <div className="flex flex-col items-center justify-start gap-6">
            <Dropdown
              {...register("category")}
              label="Category"
              options={categoryOptions}
              onSelect={() => {}}
              onClear={() => {}}
            />
            <CheckBox name="isFragile" control={control} label="Fragile" />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 active:scale-95"
            >
              Add Item
              <PlusCircle />
            </button>
          </div>
          <Input
            name="specialInstructions"
            placeholder="Special Instructions"
            register={register}
            className="col-span-2 pb-[70px] text-[16px] truncate"
          />
        </form>

        <div className="w-[45%]">
          <h2 className="text-xl font-semibold text-center mb-4">Summary</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 font-semibold">Item</th>
                <th className="py-2 font-semibold">Quantity</th>
                <th className="py-2 font-semibold">Fragile</th>
                <th className="py-2 font-semibold">Special Instructions</th>
                <th className="py-2 font-semibold">Category</th>
                <th className="py-2 font-semibold">Additional service</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item: ItemProps, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2">{item.name || "N/A"}</td>
                    <td className="py-2">{item.quantity || "N/A"}</td>
                    <td className="py-2">
                      {item.fragile === "Yes" ? "Yes" : "No"}
                    </td>
                    <td className="py-2">
                      {item.specialInstructions || "N/A"}
                    </td>
                    <td className="py-2">{item.category || "N/A"}</td>{" "}
                    <td className="py-2">{item.additionalService || "N/A"}</td>
                    <td className="py-2">
                      <button
                        onClick={() => deleteItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-2 text-gray-500 text-center">
                    No items added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-x-2">
        <button
          onClick={handleBack}
          className="border-2 border-primary text-black py-2 px-4 mt-4 font-medium"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-primary text-white py-[10px] px-8 mt-4 font-medium active:scale-95 hover:opacity-90"
        >
          Next
        </button>
      </div>
    </OnboardingLayout>
  );
};

export default ItemsStep;
