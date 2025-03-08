import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import { useAppSelector } from "@/app/store/hooks";

const Summary = () => {
  const { step } = useAppSelector((state) => state.booking);
  return <OnboardingLayout currentStep={step}>Summary</OnboardingLayout>;
};

export default Summary;
