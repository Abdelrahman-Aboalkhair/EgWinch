import DatePicker from "@/app/components/custom/DatePicker";
import Dropdown from "@/app/components/custom/Dropdown";
import Input from "@/app/components/custom/Input";
import { useUpdateDriverStepMutation } from "@/app/libs/features/apis/DriverApi";
import { nextStep } from "@/app/libs/features/slices/DriverOnboardingSlice";
import { useAppSelector } from "@/app/libs/hooks";
import React from "react";
import { useForm } from "react-hook-form";

const DriverVehicleInfo = () => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { step } = useAppSelector((state) => state.driverOnboarding);

  const [submitVehicleInfo, { data, error, isLoading }] =
    useUpdateDriverStepMutation();

  const handleSubmitVehicleInfo = async (data) => {
    const formData = new FormData();

    // vehicle info
    formData.append("vehicleModel", data.vehicleModel);
    formData.append("vehicleType", data.vehicleType);
    formData.append("vehicleColor", data.vehicleColor);
    formData.append("plateNumber", data.plateNumber);
    formData.append("licenseNumber", data.licenseNumber);
    formData.append("licenseExpiry", data.licenseExpiry);

    try {
      await submitVehicleInfo({ driverId, step, data }).unwrap();
      nextStep();
    } catch (error) {
      console.error("Vehicle info submission error:", error);
    }
  };

  return (
    <>
      <Input
        name="vehicleType"
        type="text"
        placeholder="Vehicle Type"
        register={register}
        validation={{ required: "Vehicle Type is required" }}
        error={errors.vehicleType?.message}
        className="py-[15px]"
      />
      <DatePicker name="vehicleModal" control={control} label="Vehicle Model" />

      <DatePicker
        name="licenseExpiry"
        control={control}
        label="License Expiry Date"
      />

      <Input
        name="licenseNumber"
        type="text"
        placeholder="License Number"
        register={register}
        validation={{ required: "License Number is required" }}
        error={errors.licenseNumber?.message}
        className="py-[15px]"
      />

      <Input
        name="plateNumber"
        type="text"
        placeholder="Plate Number"
        register={register}
        validation={{ required: "Plate Number is required" }}
        error={errors.plateNumber?.message}
        className="py-[15px]"
      />

      <Dropdown
        options={["Red", "Blue", "Green", "Yellow", "Black", "White"]}
        label="vehicle color"
        onSelect={(value) => setValue("vehicleColor", value)}
        onClear={() => setValue("vehicleColor", "")}
      />
    </>
  );
};

export default DriverVehicleInfo;
