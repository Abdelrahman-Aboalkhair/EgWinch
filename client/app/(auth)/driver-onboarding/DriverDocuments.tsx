import FileInput from "@/app/components/atoms/FileInput";
import { useUpdateStepMutation } from "@/app/store/apis/DriverApi";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { updateStep } from "@/app/store/slices/DriverSlice";
import { MoveLeft, MoveRight } from "lucide-react";
import { useForm } from "react-hook-form";

const DriverDocuments = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      licenseImage: null,
      profilePicture: null,
      vehicleImage: null,
    },
  });

  const dispatch = useAppDispatch();
  const { step } = useAppSelector((state) => state.driver);
  const [submitDocuments, { data, error, isLoading }] = useUpdateStepMutation();

  const handleSubmitDocuments = async (data) => {
    const formData = new FormData();
    formData.append("step", "documents");
    formData.append("driverId", driverId);

    // Append multiple files
    data.documents.forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const response = await fetch("/api/update-step/documents", {
        method: "PATCH",
        body: formData,
      });

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePrev = () => {
    dispatch(updateStep(step - 1));
  };

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit(handleSubmitDocuments)}
      className="flex flex-col items-center justify-center gap-4 w-[40%]"
    >
      <FileInput
        name="licenseImage"
        label="License Image"
        control={control}
        validation={{ required: "License Image is required" }}
        error={errors.licenseImage?.message}
        accept="image/*"
      />

      <FileInput
        name="profilePicture"
        label="Profile Picture"
        control={control}
        validation={{ required: "Profile picture is required" }}
        error={errors.profilePicture?.message}
        accept="image/*"
      />

      <FileInput
        name="vehicleImage"
        label="Vehicle Image"
        control={control}
        validation={{ required: "Vehicle Image is required" }}
        error={errors.vehicleImage?.message}
        accept="image/*"
      />
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
  );
};

export default DriverDocuments;
