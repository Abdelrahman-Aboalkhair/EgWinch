"use client";
import DriverPersonalInfo from "../DriverPersonalInfo";
import DriverVehicleInfo from "../DriverVehicleInfo";
import DriverDocuments from "../DriverDocuments";
import ReviewApplication from "../SubmitApplication";
import { useAppSelector } from "@/app/libs/hooks";
import StepProgressbar from "../StepProgressbar";
import GetStarted from "../GetStarted";

const DriverOnboarding = () => {
  const step = useAppSelector((state) => state.driverOnboarding.step);
  console.log("step: ", step);

  return (
    <main className="flex flex-col items-center justify-center">
      <StepProgressbar />
      {step === 0 && <GetStarted />}
      {step === 1 && <DriverPersonalInfo />}
      {step === 2 && <DriverVehicleInfo />}
      {step === 3 && <DriverDocuments />}
      {step === 4 && <ReviewApplication />}
    </main>
  );
};

export default DriverOnboarding;
