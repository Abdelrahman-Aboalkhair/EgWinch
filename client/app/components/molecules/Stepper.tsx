import { Check } from "lucide-react";

interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center mt-[2rem]">
      {steps.map((step, index) => {
        const isCompleted = index + 1 < currentStep;
        const isActive = index + 1 === currentStep;

        return (
          <div
            key={index}
            className="flex items-center justify-center gap-[4px]"
          >
            <div className="flex flex-col items-center justify-center">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full font-bold ml-[4px] ${
                  isActive
                    ? "border-[3px] border-primary text-primary"
                    : isCompleted
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-400 bg-opacity-90"
                }`}
              >
                {isCompleted ? (
                  <Check className="text-white" size={24} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`text-[14px] mt-2 font-medium tracking-wide ${
                  isActive ? "text-primary" : ""
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="items-center justify-center w-[120px] h-[2px] bg-gray-200 mt-[-20px]" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
