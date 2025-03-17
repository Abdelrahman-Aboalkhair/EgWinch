"use client";
import DriverPersonalInfo from "./DriverPersonalInfo";
import DriverVehicleInfo from "./DriverVehicleInfo";
import DriverDocuments from "./DriverDocuments";
import { useAppSelector } from "@/app/store/hooks";
import GetStarted from "./GetStarted";
import MainLayout from "@/app/components/templates/MainLayout";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import Summary from "./Summary";

const DriverOnboarding = () => {
  const { step } = useAppSelector((state) => state.driver);
  const steps = [
    { label: "Personal Info" },
    { label: "Vehicle Info" },
    { label: "Documents" },
    { label: "Summary" },
  ];

  return (
    <MainLayout>
      <OnboardingLayout currentStep={step} steps={steps}>
        {step === 0 && <GetStarted />}
        {step === 1 && <DriverPersonalInfo />}
        {step === 2 && <DriverVehicleInfo />}
        {step === 3 && <DriverDocuments />}
        {step === 4 && <Summary />}
      </OnboardingLayout>
    </MainLayout>
  );
};

export default DriverOnboarding;
