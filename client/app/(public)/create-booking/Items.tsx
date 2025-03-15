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
import TextArea from "@/app/components/atoms/TextArea";

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
      <div className="flex gap-10 w-full">
        <div className="flex flex-col items-start justify-start text-start w-1/2">
          <h1 className="text-[32px] font-semibold text-stone-700 pb-6">
            What&apos;re you moving?
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 ">
            <div className="grid grid-cols-2 gap-2">
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
              <TextArea
                name="specialInstructions"
                rows={4}
                cols={10}
                placeholder="Special Instructions"
                control={control}
                error={errors.details?.message}
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
        </div>
        <div className="flex flex-col w-1/2 items-center justify-center">
          <div className="rounded-lg overflow-hidden w-full">
            <Table
              data={savedItems || []}
              columns={columns}
              emptyMessage="No items added yet."
            />
          </div>
          <div className="flex justify-center items-center mt-6 gap-2">
            <Button
              onClick={handleBack}
              className="border-2 border-primary text-primary py-2 px-8 font-medium"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-primary text-white py-[10px] px-8 font-medium active:scale-95 hover:opacity-90"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default Items;
