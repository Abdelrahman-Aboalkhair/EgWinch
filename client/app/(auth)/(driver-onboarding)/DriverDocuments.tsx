import Input from "@/app/components/custom/Input";
import { useUpdateDriverStepMutation } from "@/app/libs/features/apis/DriverApi";
import { nextStep } from "@/app/libs/features/slices/DriverOnboardingSlice";
import { useAppSelector } from "@/app/libs/hooks";
import { useForm } from "react-hook-form";

const DriverDocuments = () => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { step } = useAppSelector((state) => state.driverOnboarding);

  const [submitDocuemts, { data, error, isLoading }] =
    useUpdateDriverStepMutation();

  const handleSubmitDocuments = async (data) => {
    const formData = new FormData();
    // documents
    formData.append("licenseImage", data.licenseImage);
    formData.append("profilePicture", data.profilePicture);
    formData.append("vehicleImage", data.vehicleImage);
    try {
      await submitDocuemts({ driverId, step, data }).unwrap();
      nextStep();
    } catch (error) {
      console.error("Documents submission error:", error);
    }
  };
  return (
    <>
      <Input
        name="licenseImage"
        type="file"
        placeholder="License Image"
        setValue={setValue}
        register={register}
        validation={{ required: "License Image is required" }}
        error={errors.licenseImage?.message}
        className="py-[15px]"
      />

      <Input
        name="profilePicture"
        type="file"
        placeholder="Profile picture"
        register={register}
        setValue={setValue}
        validation={{
          required: "Profile picture is required",
        }}
        error={errors.profilePicture?.message}
        className="py-[18px]"
      />

      <Input
        name="vehicleImage"
        type="file"
        placeholder="Profile picture"
        register={register}
        setValue={setValue}
        validation={{
          required: "Profile picture is required",
        }}
        error={errors.vehicleImage?.message}
        className="py-[18px]"
      />
    </>
  );
};

export default DriverDocuments;
