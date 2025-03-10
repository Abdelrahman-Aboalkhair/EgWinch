"use client";
import { useState } from "react";
import { updateItems, updateStep } from "@/app/store/slices/BookingSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Input from "@/app/components/atoms/Input";
import Dropdown from "@/app/components/molecules/Dropdown";
import { PlusCircle, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import CheckBox from "@/app/components/atoms/CheckBox";
import categoryOptions from "@/app/constants/categoryOptions";
import additionalServicesOptions from "@/app/constants/additionalServicesOptions";
import { useUpdateOnboardingStepMutation } from "@/app/store/apis/BookingApi";

interface ItemProps {
  name: string;
  quantity: string;
  fragile: boolean;
  category: string;
  additionalService: string;
  specialInstructions: string;
}

const Items = () => {
  const {
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ItemProps>({
    defaultValues: {
      name: "",
      quantity: "",
      fragile: false,
      category: "",
      additionalService: "",
      specialInstructions: "",
    },
  });
  const { step, bookingId } = useAppSelector((state) => state.booking);
  console.log("bookingId: ", bookingId);
  const [updateOnboardingStep] = useUpdateOnboardingStepMutation();
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<ItemProps[]>([]);

  const onSubmit = (data: ItemProps) => {
    setItems([...items, data]);
    reset();
  };

  const deleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    try {
      console.log("sending items: ", items);
      await updateOnboardingStep({ bookingId, step: "items", items });
      dispatch(updateStep(step + 1));
      dispatch(updateItems(items));
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleBack = () => {
    dispatch(updateStep(step - 1));
  };

  return (
    <OnboardingLayout currentStep={step}>
      <div className="flex gap-10 w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="w-1/2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="name"
              placeholder="Item Name"
              control={control}
              setValue={setValue}
              validation={{ required: true }}
              error={errors.name?.message}
            />
            <Input
              name="quantity"
              placeholder="Quantity"
              control={control}
              setValue={setValue}
              error={errors.quantity?.message}
            />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Dropdown
                  label="Category"
                  options={categoryOptions}
                  {...field}
                />
              )}
            />
            <Controller
              name="additionalService"
              control={control}
              render={({ field }) => (
                <Dropdown
                  label="Additional Service"
                  options={additionalServicesOptions}
                  {...field}
                />
              )}
            />
            <Input
              name="specialInstructions"
              placeholder="Special Instructions"
              control={control}
              setValue={setValue}
              error={errors.specialInstructions?.message}
            />
            <CheckBox name="fragile" control={control} label="Fragile" />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 active:scale-95"
          >
            <PlusCircle />
            Add Item
          </button>
        </form>

        {/* Summary Section */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold text-center mb-4">Summary</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr className="text-sm text-gray-700">
                  <th className="py-2 px-3">Item</th>
                  <th className="py-2 px-3">Qty</th>
                  <th className="py-2 px-3">Fragile</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Service</th>
                  <th className="py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-3">{item.name || "N/A"}</td>
                      <td className="py-2 px-3">{item.quantity || "N/A"}</td>
                      <td className="py-2 px-3">
                        {item.fragile ? "Yes" : "No"}
                      </td>
                      <td className="py-2 px-3">{item.category || "N/A"}</td>
                      <td className="py-2 px-3">
                        {item.additionalService || "N/A"}
                      </td>
                      <td className="py-2 px-3">
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
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      No items added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6 gap-2">
        <button
          onClick={handleBack}
          className="border-2 border-primary text-black py-2 px-4 font-medium"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-primary text-white py-[10px] px-8 font-medium active:scale-95 hover:opacity-90"
        >
          Next
        </button>
      </div>
    </OnboardingLayout>
  );
};

export default Items;
