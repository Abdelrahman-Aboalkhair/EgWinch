import DatePicker from "@/app/components/molecules/DatePicker";
import Dropdown from "@/app/components/molecules/Dropdown";
import Input from "@/app/components/atoms/Input";
import { Controller, useForm } from "react-hook-form";
import { useStartOnboardingMutation } from "@/app/store/apis/DriverApi";
import {
  setDriverId,
  updatePersonalInfo,
  updateStep,
} from "@/app/store/slices/DriverSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { PersonalInfo } from "@/app/types/Driver.types";

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
      licenseInfo: {
        number: "",
        expiry: "",
      },
    },
  });

  const dispatch = useAppDispatch();
  const { step } = useAppSelector((state) => state.driver);
  const [startOnboarding, { error, isLoading }] = useStartOnboardingMutation();

  if (error) {
    console.error("Application start error:", error);
  }

  const handleSubmitPersonalInfo = async (data: PersonalInfo) => {
    const payload = {
      personalInfo: {
        phoneNumber: data.phoneNumber,
        dateOfBirth: new Date(data.dateOfBirth),
        address: data.address,
        gender: data.gender,
        experienceYears: Number(data.experienceYears),
        licenseInfo: {
          number: data.licenseInfo?.number ?? "",
          expiry: data.licenseInfo?.expiry ?? "",
        },
      },
    };

    try {
      const result = await startOnboarding(payload).unwrap();
      console.log("result: ", result);
      dispatch(setDriverId(result.response._id));
      dispatch(updateStep(2));
      dispatch(updatePersonalInfo(result.response.personalInfo));
    } catch (error) {
      console.error("Personal Info submission error:", error);
    }
  };

  const handlePrev = () => {
    dispatch(updateStep(step - 1));
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-[50vh] p-6 gap-8">
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800">
          Tell Us About Yourself
        </h1>
        <p className="text-gray-600 mt-2">
          Help us get to know you better by filling in your personal details.
          This will ensure a smooth onboarding experience.
        </p>
      </div>

      <form
        className="w-full md:w-1/2 bg-white p-6 shadow-md rounded-lg"
        onSubmit={handleSubmit(handleSubmitPersonalInfo)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="phoneNumber"
            type="text"
            placeholder="Phone Number"
            control={control}
            validation={{ required: "Phone Number is required" }}
            error={errors.phoneNumber?.message}
          />
          <DatePicker
            name="dateOfBirth"
            control={control}
            label="Date of Birth"
          />
          <Input
            name="address"
            type="text"
            placeholder="Address"
            control={control}
            validation={{ required: "Address is required" }}
            error={errors.address?.message}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Gender"
                options={["male", "female", "unknown"]}
                {...field}
              />
            )}
          />

          <Input
            name="licenseInfo.number"
            type="text"
            placeholder="License Number"
            control={control}
            validation={{ required: "License Number is required" }}
            error={errors.licenseInfo?.number?.message}
          />
          <DatePicker
            name="licenseInfo.expiry"
            control={control}
            label="License Expiry"
          />
          <Input
            name="experienceYears"
            type="number"
            placeholder="Experience Years"
            control={control}
            validation={{ required: "Experience Years is required", min: 0 }}
            error={errors.experienceYears?.message}
          />
        </div>

        <div className="flex justify-center gap-2 mt-6">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-primary text-white py-2 px-6 
            rounded-md hover:opacity-90 active:scale-95"
          >
            {isLoading ? "Submitting..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverPersonalInfo;
