import FileInput from "@/app/components/atoms/FileInput";
import { useUpdateStepMutation } from "@/app/store/apis/DriverApi";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { updateDocuments, updateStep } from "@/app/store/slices/DriverSlice";
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
  const { step, id } = useAppSelector((state) => state.driver);
  const [submitDocuments, { error, isLoading }] = useUpdateStepMutation();

  if (error) {
    console.log("error: ", error);
  }

  const handleSubmitDocuments = async (formDataValues) => {
    const formData = new FormData();
    formData.append("step", "documents");
    formData.append("driverId", id);

    if (formDataValues.licenseImage?.[0])
      formData.append("licenseImage", formDataValues.licenseImage[0]);
    if (formDataValues.profilePicture?.[0])
      formData.append("profilePicture", formDataValues.profilePicture[0]);
    if (formDataValues.vehicleImage?.[0])
      formData.append("vehicleImage", formDataValues.vehicleImage[0]);

    console.log("FormData before sending:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const result = await submitDocuments({
        step: "documents",
        driverId: id,
        data: formData,
      }).unwrap();
      console.log("result documents: ", result);
      dispatch(updateDocuments(result.response.documents));
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
