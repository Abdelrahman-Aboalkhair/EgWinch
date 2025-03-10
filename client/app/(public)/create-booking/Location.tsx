"use client";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  setBookingId,
  updateLocations,
  updateStep,
} from "@/app/store/slices/BookingSlice";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Input from "@/app/components/atoms/Input";
import { useCreateBookingMutation } from "@/app/store/apis/BookingApi";
import { LampFloor, Loader2, MapPinHouse, Navigation } from "lucide-react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import useLocationSuggestions from "@/app/hooks/useGetLocationSuggestions";
import Button from "@/app/components/atoms/Button";
const Map = dynamic(() => import("@/app/components/molecules/Map"), {
  ssr: false,
});

const Location = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pickupLocation: "",
      pickupFloorNumber: 1,
      dropoffLocation: "",
      dropoffFloorNumber: 1,
      pickupAddress: "",
      dropoffAddress: "",
    },
  });
  const { step } = useAppSelector((state) => state.booking);

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

  const handleSelectPickup = useCallback((suggestion) => {
    setPickupAddress(suggestion.display_name);
    setPickup({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
    });
  }, []);

  const handleSelectDropoff = useCallback((suggestion) => {
    setDropoffAddress(suggestion.display_name);
    setDropoff({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
    });
  }, []);

  const handleSetPickup = useCallback((location) => {
    setPickup(location);
  }, []);

  const handleSetDropoff = useCallback((location) => {
    setDropoff(location);
  }, []);

  const mapProps = useMemo(
    () => ({
      pickup,
      dropoff,
      setPickupAddress,
      setDropoffAddress,
      onSetPickup: handleSetPickup,
      onSetDropoff: handleSetDropoff,
      setRouteDistance,
      setRouteDuration,
    }),
    [pickup, dropoff]
  );

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
    console.log("data: ", data);
    const pickupLocation = {
      type: "Point",
      coordinates: [pickup.lng, pickup.lat],
      address: data.pickupAddress,
      floorNumber: data.pickupFloorNumber,
    };
    const dropoffLocation = {
      type: "Point",
      coordinates: [dropoff.lng, dropoff.lat],
      address: data.dropoffAddress,
      floorNumber: data.dropoffFloorNumber,
    };
    try {
      const res = await createBooking({
        pickupLocation,
        dropoffLocation,
      });
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
          className="grid grid-cols-2 gap-4 w-full md:w-[40%] p-8 rounded-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            control={control}
            name="pickupLocation"
            placeholder="Pick-up Location"
            setValue={setValue}
            className="py-4 text-base truncate"
            fetchSuggestions={fetchPickupSuggestions}
            suggestions={pickupSuggestions}
            onSelectSuggestion={handleSelectPickup}
            validation={{ required: "Pick-up location is required" }}
            icon={Navigation}
            error={errors.pickupLocation?.message}
          />

          <Input
            control={control}
            name="pickupFloorNumber"
            type="number"
            setValue={setValue}
            placeholder="Floor Number"
            className="py-4 text-base truncate"
            validation={{ required: "Pick-up Floor Number is required" }}
            icon={LampFloor}
            error={errors.pickupFloorNumber?.message}
          />

          <Input
            control={control}
            name="dropoffLocation"
            placeholder="Drop-off Location"
            setValue={setValue}
            className="py-4 text-base truncate"
            fetchSuggestions={fetchDropoffSuggestions}
            suggestions={dropoffSuggestions}
            onSelectSuggestion={handleSelectDropoff}
            validation={{ required: "Drop-off location is required" }}
            icon={MapPinHouse}
            error={errors.dropoffLocation?.message}
          />
          <Input
            control={control}
            name="dropoffFloorNumber"
            type="number"
            placeholder="Floor Number"
            setValue={setValue}
            className="py-4 text-base truncate"
            validation={{ required: "Drop-off Floor Number is required" }}
            icon={LampFloor}
            error={errors.dropoffFloorNumber?.message}
          />

          <div className="flex w-full space-x-2">
            <Button
              type="button"
              className="border-2 border-primary text-black py-2 px-4 mt-4 font-medium"
            >
              Back to Home
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white py-2 px-8 mt-4 font-medium active:scale-95 hover:opacity-90"
            >
              Next
            </Button>
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
          <Map {...mapProps} />
        </Suspense>
      </div>
    </OnboardingLayout>
  );
};

export default Location;
