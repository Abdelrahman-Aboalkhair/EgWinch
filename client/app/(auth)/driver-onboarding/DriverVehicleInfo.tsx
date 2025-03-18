import DatePicker from "@/app/components/molecules/DatePicker";
import Dropdown from "@/app/components/molecules/Dropdown";
import Input from "@/app/components/atoms/Input";
import { MoveLeft, MoveRight } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useUpdateStepMutation } from "@/app/store/apis/DriverApi";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { updateStep, updateVehicleInfo } from "@/app/store/slices/DriverSlice";
import { VehicleInfo } from "@/app/types/Driver.types";

const DriverVehicleInfo = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      type: "",
      model: "",
      color: "",
      plateNumber: "",
    },
  });

  const dispatch = useAppDispatch();
  const { step, id } = useAppSelector((state) => state.driver);

  const [submitVehicleInfo, { error, isLoading }] = useUpdateStepMutation();
  if (error) console.log("error: ", error);

  const handleSubmitVehicleInfo = async (data: VehicleInfo) => {
    const payload = {
      step: "vehicle",
      driverId: id,
      data: {
        vehicleInfo: {
          type: data.type,
          model: new Date(data.model),
          color: data.color,
          plateNumber: data.plateNumber,
        },
      },
    };
    // +123-456-7890

    try {
      const result = await submitVehicleInfo(payload).unwrap();
      console.log("result: ", result);
      dispatch(updateStep(3));
      dispatch(updateVehicleInfo(result.resoponse.vehicleInfo));
    } catch (error) {
      console.error("Vehicle info submission error:", error);
    }
  };

  const handlePrev = () => dispatch(updateStep(step - 1));

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Vehicle Information
        </h2>
        <p className="text-gray-600 mt-1">
          Provide details about your vehicle to proceed with registration.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleSubmitVehicleInfo)}
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Vehicle Type"
                options={["winch", "tow truck", "flatbed"]}
                {...field}
              />
            )}
          />

          <DatePicker name="model" control={control} label="Vehicle Model" />

          <Input
            name="plateNumber"
            type="text"
            placeholder="Plate Number"
            control={control}
            validation={{ required: "Plate Number is required" }}
            error={errors.plateNumber?.message}
          />

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Vehicle Color"
                options={["Red", "Blue", "Green", "Yellow", "Black", "White"]}
                {...field}
              />
            )}
          />
        </div>

        <div className="flex justify-center gap-3 items-center">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-2 bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300"
          >
            <MoveLeft size={18} /> Back
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-primary text-white py-2 px-6 rounded"
          >
            {isLoading ? "Submitting..." : "Continue"} <MoveRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverVehicleInfo;
