import { RootState } from "@/app/libs/store";
import { resetOnboarding } from "@/app/libs/features/slices/DriverOnboardingSlice";
import axiosInstance from "@/app/helpers/axiosInstance";
import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";

const StepConfirmation = () => {
  const dispatch = useAppDispatch();
  const onboardingData = useAppSelector(
    (state: RootState) => state.driverOnboarding
  );

  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/drivers/onboarding", onboardingData);
      dispatch(resetOnboarding());
      alert("Application submitted!");
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
};

export default StepConfirmation;
