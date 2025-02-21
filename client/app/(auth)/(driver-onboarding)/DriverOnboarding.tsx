"use client";
import { RootState } from "@/app/libs/store";
import StepPersonalInfo from "./StepPersonalInfo";
import StepVehicleInfo from "./StepVehicleInfo";
import StepDocuments from "./StepDocuments";
import StepConfirmation from "./StepConfirmation";
import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import {
  nextStep,
  prevStep,
} from "@/app/libs/features/slices/DriverOnboardingSlice";

const DriverOnboarding = () => {
  const dispatch = useAppDispatch();
  const step = useAppSelector(
    (state: RootState) => state.driverOnboarding.step
  );

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Driver Onboarding</h2>
      {step === 1 && <StepPersonalInfo />}
      {step === 2 && <StepVehicleInfo />}
      {step === 3 && <StepDocuments />}
      {step === 4 && <StepConfirmation />}

      <div className="flex justify-between mt-4">
        {step > 1 && (
          <button
            onClick={() => dispatch(prevStep())}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Back
          </button>
        )}
        {step < 4 && (
          <button
            onClick={() => dispatch(nextStep())}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default DriverOnboarding;
