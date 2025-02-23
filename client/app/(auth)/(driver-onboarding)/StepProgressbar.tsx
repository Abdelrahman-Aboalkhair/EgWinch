import { useAppSelector } from "@/app/libs/hooks";
import { Check } from "lucide-react";

const steps = [
  { label: "Get Started" },
  { label: "About the Driver" },
  { label: "Vehicle Information" },
  { label: "Documents", subtext: "Upload necessary documents." },
  { label: "Submit Application" },
];

const StepProgressbar = () => {
  const { step } = useAppSelector((state) => state.driverOnboarding);

  return (
    <main className="flex items-center justify-between relative w-[50%] my-6">
      {steps.map((item, index) => {
        const stepStatus =
          index < step ? "completed" : index === step ? "current" : "upcoming";

        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center relative w-full"
          >
            {index !== 0 && (
              <div
                className={`absolute top-7 left-[-33%] rounded-full w-[55%] h-[2px] ${
                  index < step ? "bg-primary" : "bg-gray-300"
                }`}
              ></div>
            )}
            <div
              className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full font-bold ${
                stepStatus === "completed"
                  ? "bg-primary text-white"
                  : stepStatus === "current"
                  ? "border-primary border-2 bg-white text-primary"
                  : "bg-gray-300"
              }`}
            >
              {stepStatus === "completed" ? (
                <Check size={20} className="text-white" />
              ) : (
                index + 1
              )}
            </div>
            <p className="mt-3 text-sm font-medium text-center">{item.label}</p>
          </div>
        );
      })}
    </main>
  );
};

export default StepProgressbar;
