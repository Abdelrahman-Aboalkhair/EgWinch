import DatePicker from "@/app/components/molecules/DatePicker";
import Dropdown from "@/app/components/molecules/Dropdown";
import Input from "@/app/components/atoms/Input";
import { MoveLeft, MoveRight } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useUpdateStepMutation } from "@/app/store/apis/DriverApi";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { updateStep } from "@/app/store/slices/DriverSlice";

const DriverVehicleInfo = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      vehicleType: "",
      vehicleModel: "",
      vehicleColor: "",
      plateNumber: "",
      licenseNumber: "",
      licenseExpiry: "",
    },
  });
  const dispatch = useAppDispatch();
  const { step } = useAppSelector((state) => state.driver);

  const [submitVehicleInfo, { data, error, isLoading }] =
    useUpdateStepMutation();
  console.log("data: ", data);
  if (error) {
    console.log("error: ", error);
  }

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

      dispatch(updateStep(step + 1));
    } catch (error) {
      console.error("Vehicle info submission error:", error);
    }
  };

  const handlePrev = () => {
    dispatch(updateStep(step - 1));
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
        control={control}
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
        control={control}
        validation={{ required: "License Number is required" }}
        error={errors.licenseNumber?.message}
        className="py-[15px]"
      />

      <Input
        name="plateNumber"
        type="text"
        placeholder="Plate Number"
        control={control}
        validation={{ required: "Plate Number is required" }}
        error={errors.plateNumber?.message}
        className="py-[15px]"
      />
      <Controller
        name="vehicleColor"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="Color"
            options={["Red", "Blue", "Green", "Yellow", "Black", "White"]}
            {...field}
          />
        )}
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
        onClick={handlePrev}
        className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-6 rounded mt-4"
      >
        <MoveLeft size={18} />
        Back
      </button>
    </form>
  );
};

export default DriverVehicleInfo;
