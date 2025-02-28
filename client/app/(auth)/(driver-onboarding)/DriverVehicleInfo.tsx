import DatePicker from "@/app/components/molecules/DatePicker";
import Dropdown from "@/app/components/molecules/Dropdown";
import Input from "@/app/components/atoms/Input";
import { useUpdateDriverStepMutation } from "@/app/libs/features/apis/DriverApi";
import { MoveLeft, MoveRight } from "lucide-react";
import { useForm } from "react-hook-form";

const DriverVehicleInfo = ({ nextStep, prevStep }) => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm();

  const [submitVehicleInfo, { data, error, isLoading }] =
    useUpdateDriverStepMutation();
  console.log("data: ", data);

  const handleSubmitVehicleInfo = async (formData) => {
    const payload = {
      step: "vehicle_info",
      data: {
        vehicleModel: formData.vehicleModel,
        vehicleType: formData.vehicleType,
        vehicleColor: formData.vehicleColor,
        plateNumber: formData.plateNumber,
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry,
      },
    };
    console.log("payload: ", payload);

    try {
      await submitVehicleInfo(payload).unwrap();

      nextStep();
    } catch (error) {
      console.error("Vehicle info submission error:", error);
    }
  };

  return (
    <form
      className="bg-gray-50 flex flex-col items-center justify-center gap-4 p-4"
      onSubmit={handleSubmit(handleSubmitVehicleInfo)}
    >
      <Input
        name="vehicleType"
        type="text"
        placeholder="Vehicle Type"
        register={register}
        validation={{ required: "Vehicle Type is required" }}
        error={errors.vehicleType?.message}
        className="py-[15px]"
      />
      <DatePicker name="vehicleModel" control={control} label="Vehicle Model" />

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

      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-6 rounded mt-4"
      >
        {isLoading ? "Submitting..." : "Next"}
        <MoveRight size={18} />
      </button>

      <button
        type="button"
        onClick={prevStep}
        className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-6 rounded mt-4"
      >
        <MoveLeft size={18} />
        Back
      </button>
    </form>
  );
};

export default DriverVehicleInfo;
