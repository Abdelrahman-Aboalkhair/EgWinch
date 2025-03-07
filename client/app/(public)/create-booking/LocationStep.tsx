"use client";
import { useEffect, useState } from "react";
import { updateLocations, updateStep } from "@/app/store/slices/BookingSlice";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import { useAppDispatch } from "@/app/store/hooks";
import Input from "@/app/components/atoms/Input";
import {
  useCreateBookingMutation,
  useUpdateOnboardingStepMutation,
} from "@/app/store/apis/BookingApi";
import { Navigation } from "lucide-react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/components/molecules/Map"), {
  ssr: false,
});

const LocationsStep = () => {
  const { register, setValue, handleSubmit } = useForm();
  const dispatch = useAppDispatch();
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [pickup, setPickup] = useState<LatLng | null>(null);
  const [dropoff, setDropoff] = useState<LatLng | null>(null);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [createBooking, { isLoading, error }] = useCreateBookingMutation();
  const [updateOnboardingStep, { data, error: updateError }] =
    useUpdateOnboardingStepMutation();
  console.log("data: ", data);
  if (error) console.log(error);

  useEffect(() => {
    if (pickupAddress) {
      setValue("pickupAddress", pickupAddress);
    }
  }, [pickupAddress, setValue]);

  useEffect(() => {
    if (dropoffAddress) {
      setValue("dropoffAddress", dropoffAddress);
    }
  }, [dropoffAddress, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("pickupAddress", data.pickupAddress);
    formData.append("dropoffAddress", data.dropoffAddress);
    formData.append("pickupLocation", JSON.stringify(pickup));
    formData.append("dropoffLocation", JSON.stringify(dropoff));
    try {
      await createBooking({});
      await updateOnboardingStep({
        step: "location",
        // ** Complete the onboarding logic
      });
      dispatch(updateStep(1));
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <OnboardingLayout currentStep={1}>
      <div className="flex flex-col md:flex-row gap-6 w-full items-center justify-center">
        <form
          encType="multipart/form-data"
          className="flex flex-col gap-4 w-full md:w-[32%]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-[25px] font-semibold">
            Where is your move hapenning?
          </h1>
          {pickup && dropoff && (
            <p className="text-sm font-medium mb-2">
              Your route is{" "}
              <span className="text-primary font-semibold">
                {routeDistance?.toFixed(2) || 0} km
              </span>
              , which takes around{" "}
              <span className="text-primary font-semibold">
                {routeDuration?.toFixed(2) || 0} minutes
              </span>
              .
            </p>
          )}

          <Input
            name="pickupLocation"
            placeholder="Pick-up Location"
            register={register}
            className="py-4 text-base truncate"
            icon={Navigation}
          />

          <Input
            name="dropoffLocation"
            placeholder="Drop-off Location"
            register={register}
            className="py-4 text-base truncate"
          />

          <div className="space-x-2">
            <button className="border-2 border-primary text-black py-2 px-4 mt-4 font-medium">
              Back to Home
            </button>
            <button
              type="submit"
              className="bg-primary text-white py-2 px-8 mt-4 font-medium active:scale-95 hover:opacity-90"
            >
              Next
            </button>
          </div>
        </form>

        <Map
          pickup={pickup}
          dropoff={dropoff}
          setPickupAddress={setPickupAddress}
          setDropoffAddress={setDropoffAddress}
          onSetPickup={setPickup}
          onSetDropoff={setDropoff}
          setRouteDistance={setRouteDistance}
          setRouteDuration={setRouteDuration}
        />
      </div>
    </OnboardingLayout>
  );
};

export default LocationsStep;
