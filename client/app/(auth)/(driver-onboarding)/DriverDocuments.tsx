import Input from "@/app/components/atoms/Input";
import { useUpdateDriverStepMutation } from "@/app/libs/features/apis/DriverApi";
import { MoveLeft } from "lucide-react";
import { useForm } from "react-hook-form";

const DriverDocuments = ({ nextStep, prevStep }) => {
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm();

  const [submitDocuemts, { data, error, isLoading }] =
    useUpdateDriverStepMutation();
  console.log("data: ", data);
  if (error) {
    console.log("error: ", error);
  }

  const handleSubmitDocuments = async (data) => {
    const formData = new FormData();
    formData.append("step", "documents");
    formData.append("licenseImage", data.licenseImage);
    formData.append("profilePicture", data.profilePicture);
    formData.append("vehicleImage", data.vehicleImage);

    for (const entrie of formData.entries()) {
      console.log(entrie);
    }
    try {
      await submitDocuemts(formData).unwrap();
      nextStep();
    } catch (error) {
      console.error("Documents submission error:", error);
    }
  };
  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit(handleSubmitDocuments)}
    >
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
        placeholder="Vehicle Image"
        register={register}
        setValue={setValue}
        validation={{
          required: "Vehicle Imageis required",
        }}
        error={errors.vehicleImage?.message}
        className="py-[18px]"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-6 rounded mt-4"
      >
        {isLoading ? "Submitting..." : "Next"}
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

export default DriverDocuments;
