"use client";
import { useEffect, useState } from "react";
import DriverPersonalInfo from "../DriverPersonalInfo";
import DriverVehicleInfo from "../DriverVehicleInfo";
import DriverDocuments from "../DriverDocuments";
import { useAppSelector } from "@/app/store/hooks";
import StepProgressbar from "../StepProgressbar";
import GetStarted from "../GetStarted";
import useStorage from "@/app/hooks/useStorage";

const DriverOnboarding = () => {
  const userId = useAppSelector((state) => state.auth.user?.id);

  const [step, setStep] = useState<number | null>(null);
  const [storedStep, setStoredStep] = useStorage(
    userId ? `step-${userId}` : "",
    0,
    "local"
  );

  useEffect(() => {
    if (userId) {
      setStep(storedStep);
    }
  }, [userId, storedStep]);

  if (!userId || step === null) return <p>Loading...</p>;

  const nextStep = () => setStoredStep(step + 1);
  const prevStep = () => setStoredStep(step - 1);

  return (
    <main className="flex flex-col items-center justify-center">
      <StepProgressbar step={step} />
      {step === 0 && <GetStarted nextStep={nextStep} setStep={setStoredStep} />}
      {step === 1 && (
        <DriverPersonalInfo
          nextStep={nextStep}
          prevStep={prevStep}
          setStep={setStoredStep}
        />
      )}
      {step === 2 && (
        <DriverVehicleInfo
          nextStep={nextStep}
          prevStep={prevStep}
          setStep={setStoredStep}
        />
      )}
      {step === 3 && (
        <DriverDocuments
          prevStep={prevStep}
          nextStep={nextStep}
          setStep={setStoredStep}
        />
      )}
      {step === 4 && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold text-center">
            Your application is currently under review
          </h1>
          <p className="text-lg">Please wait for approval</p>
        </div>
      )}
    </main>
  );
};

export default DriverOnboarding;
