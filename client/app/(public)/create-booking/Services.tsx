"use client";
import { updateServices, updateStep } from "@/app/store/slices/BookingSlice";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { Controller, useForm } from "react-hook-form";
import additionalServicesOptions from "@/app/constants/additionalServicesOptions";
import { useUpdateOnboardingStepMutation } from "@/app/store/apis/BookingApi";
import Dropdown from "@/app/components/molecules/Dropdown";
import Input from "@/app/components/atoms/Input";
import Button from "@/app/components/atoms/Button";
import { Trash2 } from "lucide-react";
import Table from "@/app/components/organisms/Table";

const Services = () => {
  const {
    services: savedServices,
    step,
    bookingId,
  } = useAppSelector((state) => state.booking);
  console.log("savedServices: ", savedServices);
  const dispatch = useAppDispatch();
  const [updateOnboardingStep] = useUpdateOnboardingStepMutation();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{ name: string; details: string }>({
    defaultValues: { name: "", details: "" },
  });

  const addService = (data: { name: string; details: string }) => {
    if (!data.name) return;
    const newServices = [
      ...savedServices,
      { name: data.name, details: data.details },
    ];
    dispatch(updateServices(newServices));
    reset();
  };

  const deleteService = (index: number) => {
    if (!savedServices) return;

    const newServices = savedServices.filter((_, i) => i !== index);
    dispatch(updateServices(newServices));
  };

  const onSubmit = async () => {
    try {
      await updateOnboardingStep({
        bookingId,
        step: "services",
        services: savedServices,
      });
      dispatch(updateStep(step + 1));
    } catch (error) {
      console.error("Error updating step:", error);
    }
  };

  const columns = [
    { key: "name", label: "Service" },
    { key: "details", label: "Details" },
    {
      key: "actions",
      label: "Action",
      render: (_: any, index: number) => (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            deleteService(index);
          }}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      ),
    },
  ];

  return (
    <OnboardingLayout currentStep={step}>
      <form onSubmit={handleSubmit(addService)} className="p-4 space-y-4">
        <h1 className="text-[28px] font-semibold">
          Enhance your move with extra services
        </h1>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Choose your additional services"
              options={additionalServicesOptions}
              {...field}
            />
          )}
        />
        <Input
          name="details"
          type="text"
          placeholder="Details"
          control={control}
          setValue={setValue}
          error={errors.details?.message}
        />
        <Button
          type="submit"
          className="bg-primary text-white py-[10px] px-12 font-medium"
        >
          Add
        </Button>
      </form>

      <div className="w-1/2 mt-6">
        <h2 className="text-xl font-semibold text-center mb-4">Summary</h2>
        <div className="border rounded-lg overflow-hidden">
          <Table
            data={savedServices || []}
            columns={columns}
            emptyMessage="No services added yet."
          />
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <Button
          type="button"
          onClick={() => dispatch(updateStep(step - 1))}
          className="border-2 border-primary text-black py-2 px-10 font-medium"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          className="bg-primary text-white py-[10px] px-12 font-medium active:scale-95 hover:opacity-90"
        >
          Next
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default Services;
