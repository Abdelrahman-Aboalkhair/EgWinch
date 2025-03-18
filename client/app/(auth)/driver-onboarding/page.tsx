"use client";

import { useAppSelector } from "@/app/store/hooks";
import MainLayout from "@/app/components/templates/MainLayout";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import DriverPersonalInfo from "./DriverPersonalInfo";
import DriverVehicleInfo from "./DriverVehicleInfo";
import DriverDocuments from "./DriverDocuments";
import Summary from "./Summary";

const steps = [
  { label: "Personal Info" },
  { label: "Vehicle Info" },
  { label: "Documents" },
  { label: "Summary" },
];

const DriverOnboarding = () => {
  const { step } = useAppSelector((state) => state.driver);
  console.log("step: ", step);

  return (
    <MainLayout>
      <OnboardingLayout currentStep={step} steps={steps}>
        {step === 1 && <DriverPersonalInfo />}
        {step === 2 && <DriverVehicleInfo />}
        {step === 3 && <DriverDocuments />}
        {step === 4 && <Summary />}
      </OnboardingLayout>
    </MainLayout>
  );
};

export default DriverOnboarding;
