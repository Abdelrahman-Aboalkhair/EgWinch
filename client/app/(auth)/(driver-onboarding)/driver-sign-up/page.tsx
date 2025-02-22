"use client";
import { useForm } from "react-hook-form";
import DriverPersonalInfo from "../DriverPersonalInfo";
import DriverVehicleInfo from "../DriverVehicleInfo";
import DriverDocuments from "../DriverDocuments";
import ReviewApplication from "../ReviewApplication";
import {
  useStartOnboardingMutation,
  useSubmitForReviewMutation,
  useUpdateDriverStepMutation,
} from "@/app/libs/features/apis/DriverApi";
import useStorage from "@/app/hooks/useStorage";
import { useAppSelector } from "@/app/libs/hooks";

interface InputForm {
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  experienceYears: number;
  vehicleType: string;
  vehicleModel: string;
  vehicleColor: string;
  plateNumber: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseImage: string;
  profilePicture: string;
  vehicleImage: string;
}

const DriverOnboarding = () => {
  const { user } = useAppSelector((state) => state.auth);
  const driverId = user?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<InputForm>();
  const [step, setStep] = useStorage("driverOnboardingStep", 1, "local");

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const [startApplication] = useStartOnboardingMutation();

  const [updateDriverStep, { data: stepData, error: stepError }] =
    useUpdateDriverStepMutation();

  const [submitForReview, { data: reviewData, error: reviewError }] =
    useSubmitForReviewMutation();

  const onSubmit = async (data: InputForm) => {
    const formData = new FormData();

    console.log("FormData entries: ");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
    } catch (error) {
      console.error("Error occurred while signing up", error);
    }
  };

  const handleStepSubmit = async (data) => {
    try {
      await updateDriverStep({ driverId, step, data }).unwrap();
      nextStep();
    } catch (error) {
      console.error("Step submission error:", error);
    }
  };

  const handleSubmitPersonalInfo = async (data) => {
    const formData = new FormData();
    // personal info
    formData.append("address", data.address);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("gender", data.gender);
    formData.append("experienceYears", data.experienceYears.toString());
    try {
      await startApplication(data).unwrap();
      nextStep();
    } catch (error) {
      console.error("Application start error:", error);
    }
  };

  const handleSubmitVehicleInfo = async (data) => {
    const formData = new FormData();

    // vehicle info
    formData.append("vehicleModel", data.vehicleModel);
    formData.append("vehicleType", data.vehicleType);
    formData.append("vehicleColor", data.vehicleColor);
    formData.append("plateNumber", data.plateNumber);
    formData.append("licenseNumber", data.licenseNumber);
    formData.append("licenseExpiry", data.licenseExpiry);

    try {
      await updateDriverStep({ driverId, step, data }).unwrap();
      nextStep();
    } catch (error) {
      console.error("Vehicle info submission error:", error);
    }
  };

  const handleSubmitDocuments = async (data) => {
    const formData = new FormData();
    // documents
    formData.append("licenseImage", data.licenseImage);
    formData.append("profilePicture", data.profilePicture);
    formData.append("vehicleImage", data.vehicleImage);
    try {
      await updateDriverStep({ driverId, step, data }).unwrap();
      nextStep();
    } catch (error) {
      console.error("Documents submission error:", error);
    }
  };

  const handleSubmitReview = async (data) => {
    try {
      await submitForReview({ driverId, data }).unwrap();
      nextStep();
    } catch (error) {
      console.error("Review submission error:", error);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-[50%] p-6 bg-white shadow-md rounded-lg">
        {error && (
          <div className="bg-red-100 border border-red-400 text-center text-red-700 px-4 py-[15px] rounded relative mb-4">
            <span className="block sm:inline">
              {error?.message || "An unexpected error occurred."}
            </span>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-full flex-col flex items-center justify-center"
        >
          <div className="grid grid-cols-2 gap-2 ">
            {step === 1 && (
              <DriverPersonalInfo
                register={register}
                errors={errors}
                control={control}
                setValue={setValue}
              />
            )}
            {step === 2 && (
              <DriverVehicleInfo
                register={register}
                errors={errors}
                control={control}
                setValue={setValue}
              />
            )}
            {step === 3 && (
              <DriverDocuments
                register={register}
                errors={errors}
                control={control}
                setValue={setValue}
              />
            )}
            {step === 4 && <ReviewApplication />}
          </div>

          <div className="flex justify-between mt-4">
            {step > 1 && <button onClick={prevStep}>Back</button>}
            {step < 4 ? (
              <button onClick={nextStep}>Next</button>
            ) : (
              <button type="submit">Submit</button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
};

export default DriverOnboarding;
