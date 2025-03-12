"use client";
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
import Table from "@/app/components/organisms/Table";
import Button from "@/app/components/atoms/Button";

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

  const {
    step,
    items: savedItems,
    bookingId,
  } = useAppSelector((state) => state.booking);
  const [updateOnboardingStep] = useUpdateOnboardingStepMutation();
  const dispatch = useAppDispatch();

  const onSubmit = (data: ItemProps) => {
    const newItems = [...savedItems, data];
    dispatch(updateItems(newItems));
    reset();
  };

  const deleteItem = (index: number) => {
    const newItems = savedItems.filter((_, i) => i !== index);
    dispatch(updateItems(newItems));
  };

  const handleNext = async () => {
    try {
      console.log("sending items: ", savedItems);
      await updateOnboardingStep({
        bookingId,
        step: "items",
        items: savedItems,
      });
      dispatch(updateStep(step + 1));
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleBack = () => {
    dispatch(updateStep(step - 1));
  };

  const columns = [
    { key: "name", label: "Item" },
    { key: "quantity", label: "Qty" },
    {
      key: "fragile",
      label: "Fragile",
      render: (row: ItemProps) => (row.fragile ? "Yes" : "No"),
    },
    { key: "category", label: "Category" },
    { key: "additionalService", label: "Service" },
    {
      key: "actions",
      label: "Action",
      render: (_: any, index: number) => (
        <Button
          onClick={() => deleteItem(index)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </Button>
      ),
    },
  ];

  return (
    <OnboardingLayout currentStep={step}>
      <div className="flex flex-col items-center justify-center text-center w-[45%] mx-auto">
        <h1 className="text-[34px] tracking-wide font-bold text-stone-800">
          What&apos;s Moving With You?
        </h1>
        <p className="text-gray-800 pt-1 text-[16px]">
          List your furniture, appliances, and any fragile items so we can match
          you with the right equipment and winch driver.
        </p>
      </div>
      <div className="flex gap-10 w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="w-1/2 space-y-4 ">
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="name"
              type="text"
              placeholder="Item Name"
              control={control}
              setValue={setValue}
              validation={{ required: true }}
              error={errors.name?.message}
            />
            <Input
              name="quantity"
              type="number"
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
              type="text"
              placeholder="Special Instructions"
              control={control}
              setValue={setValue}
              error={errors.specialInstructions?.message}
            />
            <CheckBox name="fragile" control={control} label="Fragile" />
          </div>
          <Button
            type="submit"
            className="flex items-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 active:scale-95"
          >
            <PlusCircle />
            Add Item
          </Button>
        </form>

        <div className="w-1/2">
          <div className="border rounded-lg overflow-hidden">
            <Table
              data={savedItems || []}
              columns={columns}
              emptyMessage="No items added yet."
            />
          </div>
          <div className="flex justify-center items-center mt-6 gap-2">
            <Button
              onClick={handleBack}
              className="border-2 border-primary text-black py-2 px-4 font-medium"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-primary text-white py-[10px] px-8 font-medium active:scale-95 hover:opacity-90"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default Items;
