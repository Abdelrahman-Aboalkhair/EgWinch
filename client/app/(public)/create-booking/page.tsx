"use client";
import MainLayout from "@/app/components/templates/MainLayout";
import { useAppSelector } from "@/app/store/hooks";
import LocationsStep from "./Locations";
import ItemsStep from "./Items";
import ServicesStep from "./Services";
import ConfirmationStep from "./Summary";

const BookingOnboarding = () => {
  const { step } = useAppSelector((state) => state.booking);
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
