"use client";
import { Suspense, useEffect, useState } from "react";
import { setBookingId, updateStep } from "@/app/store/slices/BookingSlice";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Input from "@/app/components/atoms/Input";
import { useCreateBookingMutation } from "@/app/store/apis/BookingApi";
import { Loader2, Navigation } from "lucide-react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/components/molecules/Map"), {
  ssr: false,
});

const Locations = () => {
  const { step } = useAppSelector((state) => state.booking);
  const { register, setValue, handleSubmit } = useForm();
  const dispatch = useAppDispatch();
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [pickup, setPickup] = useState<LatLng | null>(null);
  const [dropoff, setDropoff] = useState<LatLng | null>(null);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [createBooking, { error }] = useCreateBookingMutation();

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
    try {
      const res = await createBooking({
        pickupLocation: {
          type: "Point",
          coordinates: [pickup.lng, pickup.lat],
          address: pickupAddress,
          floorNumber: data.pickupFloorNumber,
        },
        dropoffLocation: {
          type: "Point",
          coordinates: [dropoff.lng, dropoff.lat],
          address: dropoffAddress,
          floorNumber: data.dropoffFloorNumber,
        },
      });

      console.log("res: ", res);
      dispatch(setBookingId(res.data._id));
      dispatch(updateStep(step + 1));
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <OnboardingLayout currentStep={step}>
      <div className="flex flex-col md:flex-row gap-6 w-full items-center justify-between">
        <form
          className="grid grid-cols-2 gap-4 w-full md:w-[40%]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            name="pickupLocation"
            type="text"
            placeholder="Pick-up Location"
            register={register}
            className="py-4 text-base truncate"
            icon={Navigation}
          />
          <Input
            name="pickupFloorNumber"
            type="number"
            placeholder="Floor Number"
            register={register}
            className="py-4 text-base truncate"
          />

          <Input
            name="dropoffLocation"
            placeholder="Drop-off Location"
            register={register}
            className="py-4 text-base truncate"
          />
          <Input
            name="dropoffFloorNumber"
            type="number"
            placeholder="Floor Number"
            register={register}
            className="py-4 text-base truncate"
          />

          <div className="flex w-full space-x-2">
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

        <Suspense
          fallback={
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-md font-medium">Loading Map</h1>
              <Loader2 className="animate-spin text-primary" />
            </div>
          }
        >
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
        </Suspense>
      </div>
    </OnboardingLayout>
  );
};

export default Locations;
