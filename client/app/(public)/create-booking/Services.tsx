"use client";
import { updateServices, updateStep } from "@/app/store/slices/BookingSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { Controller, useForm } from "react-hook-form";
import additionalServicesOptions from "@/app/constants/additionalServicesOptions";
import { useUpdateOnboardingStepMutation } from "@/app/store/apis/BookingApi";
import Dropdown from "@/app/components/molecules/Dropdown";
import Button from "@/app/components/atoms/Button";
import { Trash2 } from "lucide-react";
import Table from "@/app/components/organisms/Table";
import TextArea from "@/app/components/atoms/TextArea";

const Services = () => {
  const {
    services: savedServices,
    step,
    bookingId,
  } = useAppSelector((state) => state.booking);
  const dispatch = useAppDispatch();
  const [updateOnboardingStep] = useUpdateOnboardingStepMutation();

  const {
    handleSubmit,
    control,
    reset,
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

  const handleNext = async () => {
    try {
      await updateOnboardingStep({
        bookingId,
        step: "services",
        additionalServices: savedServices,
      });
      dispatch(updateStep(step + 1));
    } catch (error) {
      console.error("Error updating step:", error);
    }
  };

  const handleBack = () => {
    dispatch(updateStep(step - 1));
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
    <>
      <div className="flex items-center justify-between w-full mt-[2rem]">
        <form onSubmit={handleSubmit(addService)} className="w-[25%] space-y-4">
          <div className="flex flex-col items-start justify-start text-start w-[40rem]">
            <h1 className="text-[32px] font-semibold text-stone-700">
              Need Extra Help?
            </h1>
          </div>
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
          <TextArea
            name="details"
            rows={4}
            cols={50}
            placeholder="Details"
            control={control}
            error={errors.details?.message}
          />
          <Button
            type="submit"
            className="bg-primary text-white py-[10px] w-full font-medium"
          >
            Add
          </Button>
        </form>

        <div className="w-1/2 flex flex-col items-center justify-center mt-[5.5rem]">
          <div className="w-full rounded-lg overflow-hidden">
            <Table
              data={savedServices || []}
              columns={columns}
              emptyMessage="No services added yet."
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
    </>
  );
};

export default Services;
