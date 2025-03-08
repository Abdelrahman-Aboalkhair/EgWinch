"use client";
import { Suspense, useEffect, useState } from "react";
import {
  setBookingId,
  updateLocations,
  updateStep,
} from "@/app/store/slices/BookingSlice";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Input from "@/app/components/atoms/Input";
import { useCreateBookingMutation } from "@/app/store/apis/BookingApi";
import { Loader2, Navigation } from "lucide-react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import useLocationSuggestions from "@/app/hooks/useGetLocationSuggestions";

const Map = dynamic(() => import("@/app/components/molecules/Map"), {
  ssr: false,
});

const Location = () => {
  const { step } = useAppSelector((state) => state.booking);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useAppDispatch();
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [pickup, setPickup] = useState<LatLng | null>(null);
  const [dropoff, setDropoff] = useState<LatLng | null>(null);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [createBooking, { error }] = useCreateBookingMutation();
  const {
    suggestions: pickupSuggestions,
    fetchSuggestions: fetchPickupSuggestions,
  } = useLocationSuggestions();
  const {
    suggestions: dropoffSuggestions,
    fetchSuggestions: fetchDropoffSuggestions,
  } = useLocationSuggestions();

  const handleSelectPickup = (suggestion) => {
    setPickupAddress(suggestion.display_name);
    setPickup({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
    });
  };

  const handleSelectDropoff = (suggestion) => {
    setDropoffAddress(suggestion.display_name);
    setDropoff({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
    });
  };

  useEffect(() => {
    if (pickupAddress) {
      setValue("pickupLocation", pickupAddress);
      setValue("pickupAddress", pickupAddress);
    }
  }, [pickupAddress, setValue]);

  useEffect(() => {
    if (dropoffAddress) {
      setValue("dropoffLocation", dropoffAddress);
      setValue("dropoffAddress", dropoffAddress);
    }
  }, [dropoffAddress, setValue]);

  if (error) console.log(error);

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
      dispatch(
        updateLocations({
          pickup: res.data.pickupLocation,
          dropoff: res.data.dropoffLocation,
        })
      );
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <OnboardingLayout currentStep={step}>
      <div className="flex flex-col md:flex-row gap-6 w-full items-center justify-between">
        {routeDistance && routeDuration && (
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold">
              {routeDistance.toFixed(2)} km
            </span>
            <span className="text-2xl font-semibold">
              {routeDuration.toFixed(2)} min
            </span>
          </div>
        )}
        <form
          className="grid grid-cols-2 gap-4 w-full md:w-[40%] bg-white shadow-md p-8 rounded-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-start justify-start gap-2">
            <Input
              name="pickupLocation"
              value={pickupAddress}
              placeholder="Pick-up Location"
              register={register}
              className="py-4 text-base truncate"
              fetchSuggestions={fetchPickupSuggestions}
              suggestions={pickupSuggestions}
              onSelectSuggestion={handleSelectPickup}
              validation={{ required: "Pick-up location is required" }}
            />
            {errors.pickupLocation && (
              <span className="text-red-500 text-sm">
                {errors.pickupLocation.message}
              </span>
            )}
          </div>
          <div className="flex flex-col items-start justify-start gap-2">
            <Input
              name="pickupFloorNumber"
              value={dropoffAddress}
              type="number"
              placeholder="Floor Number"
              register={register}
              className="py-4 text-base truncate"
              validation={{ required: "Pick-up Floor Number is required" }}
            />
            {errors.pickupFloorNumber && (
              <span className="text-red-500 text-sm">
                {errors.pickupFloorNumber.message}
              </span>
            )}
          </div>

          <div className="flex flex-col items-start justify-start gap-2">
            <Input
              name="dropoffLocation"
              placeholder="Drop-off Location"
              register={register}
              className="py-4 text-base truncate"
              fetchSuggestions={fetchDropoffSuggestions}
              suggestions={dropoffSuggestions}
              onSelectSuggestion={handleSelectDropoff}
              validation={{ required: "Drop-off location is required" }}
            />
            {errors.dropoffLocation && (
              <span className="text-red-500 text-sm">
                {errors.dropoffLocation.message}
              </span>
            )}
          </div>
          <div className="flex flex-col items-start justify-start gap-2">
            <Input
              name="dropoffFloorNumber"
              type="number"
              placeholder="Floor Number"
              register={register}
              className="py-4 text-base truncate"
              validation={{ required: "Drop-off Floor Number is required" }}
            />
            {errors.dropoffFloorNumber && (
              <span className="text-red-500 text-sm">
                {errors.dropoffFloorNumber.message}
              </span>
            )}
          </div>

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

export default Location;
