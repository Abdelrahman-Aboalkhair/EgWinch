import React from "react";
import Stepper from "../molecules/Stepper";

const steps = [
  { label: "Location" },
  { label: "Items" },
  { label: "Services" },
  { label: "Summary" },
];

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
}) => {
  return (
    <main className="flex flex-col items-center justify-center gap-[4rem]">
      <Stepper steps={steps} currentStep={currentStep} />
      {children}
    </main>
  );
};

export default OnboardingLayout;
