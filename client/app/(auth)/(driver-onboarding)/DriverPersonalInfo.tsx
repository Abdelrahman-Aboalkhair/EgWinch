import DatePicker from "@/app/components/custom/DatePicker";
import Dropdown from "@/app/components/custom/Dropdown";
import Input from "@/app/components/custom/Input";
import { useUpdateDriverStepMutation } from "@/app/libs/features/apis/DriverApi";
import { nextStep } from "@/app/libs/features/slices/DriverOnboardingSlice";
import { useAppDispatch } from "@/app/libs/hooks";
import { MoveRight } from "lucide-react";
import { useForm } from "react-hook-form";

const DriverPersonalInfo = () => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm();
  const [submitPersonalInfo, { data, error, isLoading }] =
    useUpdateDriverStepMutation();
  const dispatch = useAppDispatch();

  const handleSubmitPersonalInfo = async (formData) => {
    const payload = {
      step: "personal_info",
      data: {
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        gender: formData.gender,
        experienceYears: Number(formData.experienceYears),
      },
    };

    console.log("payload: ", payload);

    try {
      await submitPersonalInfo(payload).unwrap();
      dispatch(nextStep());
    } catch (error) {
      console.error("Personal Info submission error:", error);
    }
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
        register={register}
        validation={{ required: "Phone Number is required" }}
        error={errors.phoneNumber?.message}
        className="py-[15px]"
      />
      <DatePicker name="dateOfBirth" control={control} label="Date of Birth" />
      <Input
        name="address"
        type="text"
        placeholder="Address"
        register={register}
        validation={{ required: "Address is required" }}
        error={errors.address?.message}
        className="py-[18px]"
      />
      <Dropdown
        options={["Male", "Female", "Other"]}
        label="Gender"
        onSelect={(value) => setValue("gender", value)}
        onClear={() => setValue("gender", "")}
      />
      <Input
        name="experienceYears"
        type="number"
        placeholder="Experience Years"
        register={register}
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
    </form>
  );
};

export default DriverPersonalInfo;
