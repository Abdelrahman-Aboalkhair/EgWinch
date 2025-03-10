"use client";
import MainLayout from "@/app/components/templates/MainLayout";
import { useAppSelector } from "@/app/store/hooks";
import LocationsStep from "./Location";
import ItemsStep from "./Items";
import ServicesStep from "./Services";
import ConfirmationStep from "./Summary";
import ProtectedRoute from "@/app/(private)/ProtectedRoute";

const BookingOnboarding = () => {
  const { step } = useAppSelector((state) => state.booking);
  return (
    <ProtectedRoute>
      <MainLayout>
        {step == 1 && <LocationsStep />}
        {step == 2 && <ItemsStep />}
        {step == 3 && <ServicesStep />}
        {step == 4 && <ConfirmationStep />}
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BookingOnboarding;
