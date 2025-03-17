import DatePicker from "@/app/components/molecules/DatePicker";
import Dropdown from "@/app/components/molecules/Dropdown";
import Input from "@/app/components/atoms/Input";
import { MoveLeft, MoveRight } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useUpdateStepMutation } from "@/app/store/apis/DriverApi";
import { updateStep } from "@/app/store/slices/DriverSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

const DriverPersonalInfo = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
      gender: "",
      experienceYears: "",
    },
  });
  const dispatch = useAppDispatch();
  const { step } = useAppSelector((state) => state.driver);
  const [submitPersonalInfo, { data, error, isLoading }] =
    useUpdateStepMutation();
  console.log("data: ", data);

  if (error) {
    console.log("error: ", error);
  }

  const handleSubmitPersonalInfo = async (data) => {
    const payload = {
      step: "personal_info",
      data: {
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        gender: data.gender,
        experienceYears: Number(data.experienceYears),
      },
    };

    console.log("payload: ", payload);

    try {
      await submitPersonalInfo(payload).unwrap();

      dispatch(updateStep(step + 1));
    } catch (error) {
      console.error("Personal Info submission error:", error);
    }
  };

  const handlePrev = () => {
    dispatch(updateStep(step - 1));
  };

  return (
    <form
      className="bg-gray-50 flex flex-col items-center justify-center gap-4 p-4"
      onSubmit={handleSubmit(handleSubmitPersonalInfo)}
    >
      <Input
        name="phoneNumber"
        type="text"
        placeholder="Phone Number"
        control={control}
        validation={{ required: "Phone Number is required" }}
        error={errors.phoneNumber?.message}
      />
      <DatePicker name="dateOfBirth" control={control} label="Date of Birth" />
      <Input
        name="address"
        type="text"
        placeholder="Address"
        control={control}
        validation={{ required: "Address is required" }}
        error={errors.address?.message}
        className="py-[18px]"
      />
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <Dropdown
            label="Additional Service"
            options={["Male", "Female", "Other"]}
            {...field}
          />
        )}
      />
      <Input
        name="experienceYears"
        type="number"
        placeholder="Experience Years"
        control={control}
        validation={{ required: "Experience Years is required", min: 0 }}
        error={errors.experienceYears?.message}
        className="py-[18px]"
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

export default DriverPersonalInfo;
