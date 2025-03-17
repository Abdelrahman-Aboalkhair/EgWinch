"use client";
import MainLayout from "@/app/components/templates/MainLayout";
import { useAppSelector } from "@/app/store/hooks";
import LocationsStep from "./Location";
import ItemsStep from "./Items";
import ServicesStep from "./Services";
import ConfirmationStep from "./Summary";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";

const BookingOnboarding = () => {
  const steps = [
    { label: "Locations" },
    { label: "Items" },
    { label: "Services" },
    { label: "Summary" },
  ];

  const { step } = useAppSelector((state) => state.booking);
  return (
    <MainLayout>
      <OnboardingLayout currentStep={step} steps={steps}>
        {step == 1 && <LocationsStep />}
        {step == 2 && <ItemsStep />}
        {step == 3 && <ServicesStep />}
        {step == 4 && <ConfirmationStep />}
      </OnboardingLayout>
    </MainLayout>
  );
};

export default BookingOnboarding;
