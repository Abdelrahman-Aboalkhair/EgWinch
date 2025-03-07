"use client";
import MainLayout from "@/app/components/templates/MainLayout";
import { useAppSelector } from "@/app/store/hooks";
import LocationsStep from "./LocationStep";
import ItemsStep from "./ItemsStep";
import ServicesStep from "./ServicesStep";
import ConfirmationStep from "./ConfirmationStep";

const BookingOnboarding = () => {
  const { step } = useAppSelector((state) => state.booking);
  console.log("step: ", step);
  return (
    <MainLayout>
      {step == 1 && <LocationsStep />}
      {step == 2 && <ItemsStep />}
      {step == 3 && <ServicesStep />}
      {step == 4 && <ConfirmationStep />}
    </MainLayout>
  );
};

export default BookingOnboarding;
