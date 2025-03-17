import Input from "@/app/components/atoms/Input";
import { useUpdateStepMutation } from "@/app/store/apis/DriverApi";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { updateStep } from "@/app/store/slices/DriverSlice";
import { MoveLeft } from "lucide-react";
import { useForm } from "react-hook-form";

const DriverDocuments = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      licenseImage: "",
      profilePicture: "",
      vehicleImage: "",
    },
  });
  const dispatch = useAppDispatch();
  const { step } = useAppSelector((state) => state.driver);

  const [submitDocuemts, { data, error, isLoading }] = useUpdateStepMutation();
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
      dispatch(updateStep(step + 1));
    } catch (error) {
      console.error("Documents submission error:", error);
    }
  };

  const handlePrev = () => {
    dispatch(updateStep(step - 1));
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
        control={control}
        validation={{ required: "License Image is required" }}
        error={errors.licenseImage?.message}
        className="py-[15px]"
      />

      <Input
        name="profilePicture"
        type="file"
        placeholder="Profile picture"
        control={control}
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
        control={control}
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
        onClick={handlePrev}
        className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-6 rounded mt-4"
      >
        <MoveLeft size={18} />
        Back
      </button>
    </form>
  );
};

export default DriverDocuments;
