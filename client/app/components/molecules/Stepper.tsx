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
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold ${
              index + 1 === currentStep
                ? "bg-primary text-white "
                : "bg-gray-200 text-gray-700 bg-opacity-90"
            }`}
          >
            {index + 1}
          </div>
          <span className="text-sm mt-2 font-medium tracking-wide">
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
