import { Check, CheckCircle, Circle } from "lucide-react";

interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center space-x-16">
      {steps.map((step, index) => {
        const isCompleted = index + 1 < currentStep;
        const isActive = index + 1 === currentStep;

        return (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full font-bold transition-all ${
                isActive
                  ? "border-[3px] border-primary text-primary "
                  : isCompleted
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 bg-opacity-90"
              }`}
            >
              {isCompleted ? (
                <Check className="text-white" size={24} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className="text-sm mt-2 font-medium tracking-wide">
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
