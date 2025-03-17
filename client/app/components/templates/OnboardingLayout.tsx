import React from "react";
import Stepper from "../molecules/Stepper";

interface Step {
  label: string;
}

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  steps: Step[];
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  steps,
}) => {
  return (
    <main className="flex flex-col items-center justify-center gap-[4rem]">
      <Stepper steps={steps} currentStep={currentStep} />
      {children}
    </main>
  );
};

export default OnboardingLayout;
