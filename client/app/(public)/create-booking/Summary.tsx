import { motion } from "framer-motion";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Button from "@/app/components/atoms/Button";
import { updateStep } from "@/app/store/slices/BookingSlice";
import { useUpdateOnboardingStepMutation } from "@/app/store/apis/BookingApi";
import useToast from "@/app/hooks/ui/useToast";
import { useRouter } from "next/navigation";
import BookingCard from "@/app/components/sections/booking/BookingCard";

const Summary = () => {
  const { step, bookingId, items, services, pickup, dropoff } = useAppSelector(
    (state) => state.booking
  );
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const router = useRouter();

  const [updateOnboardingStep] = useUpdateOnboardingStepMutation();

  const createBooking = async () => {
    try {
      await updateOnboardingStep({
        bookingId,
        step: "completed",
      });
      router.push("/bookings");
      showToast("Booking created successfully", "success");
    } catch (error) {
      console.error("Error updating step:", error);
    }
  };

  const handleBack = () => {
    dispatch(updateStep(step - 1));
  };

  return (
    <OnboardingLayout currentStep={step}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center w-full mt-[2rem]"
      >
        <div
          className="flex flex-col items-start justify-start gap-2 w-[40%]
        "
        >
          <h1 className="text-[33px] font-semibold text-stone-700">
            Review Your Booking Details
          </h1>
          <p className="text-gray-600 text-[16px]">
            Make sure everything looks good before confirming your booking. You
            can go back to make changes or proceed to create your booking.
          </p>
          <div className="flex justify-center items-center mt-6 gap-2">
            <Button
              onClick={handleBack}
              className="border-2 border-primary text-primary py-2 px-8 font-medium"
            >
              Back
            </Button>
            <Button
              onClick={createBooking}
              className="bg-primary text-white py-[10px] px-8 font-medium active:scale-95 hover:opacity-90"
            >
              Create Booking
            </Button>
          </div>
          <BookingCard
            key={bookingId}
            items={items}
            services={services}
            pickup={pickup}
            dropoff={dropoff}
          />
        </div>
      </motion.div>
    </OnboardingLayout>
  );
};

export default Summary;
