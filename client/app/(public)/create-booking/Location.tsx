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
import Link from "next/link";
import { LatLng } from "@/app/types/Booking.types";
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
  const {
    step,
    pickup: savedPickup,
    dropoff: savedDropoff,
  } = useAppSelector((state) => state.booking);

  const dispatch = useAppDispatch();
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [pickup, setPickup] = useState<LatLng | null>(null);
  const [dropoff, setDropoff] = useState<LatLng | null>(null);
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
    }),
    [pickup, dropoff]
  );

  useEffect(() => {
    if (savedPickup) {
      setPickupAddress(savedPickup.address);
      setPickup({
        lat: savedPickup.coordinates[1],
        lng: savedPickup.coordinates[0],
      });
      setValue("pickupFloorNumber", savedPickup.floorNumber || 1);
    }
    if (savedDropoff) {
      setDropoffAddress(savedDropoff.address);
      setDropoff({
        lat: savedDropoff.coordinates[1],
        lng: savedDropoff.coordinates[0],
      });
    }
    setValue("dropoffFloorNumber", savedDropoff.floorNumber || 1);
  }, []);

  useEffect(() => {
    if (pickupAddress) {
      setValue("pickupLocation", pickupAddress);
      setValue("pickupAddress", pickupAddress);
    }
  }, [pickupAddress, savedPickup, setValue]);

  useEffect(() => {
    if (dropoffAddress) {
      setValue("dropoffLocation", dropoffAddress);
      setValue("dropoffAddress", dropoffAddress);
    }
  }, [dropoffAddress, savedDropoff, setValue]);

  if (error) console.log(error);

  const onSubmit = async (data) => {
    const pickupLocation = {
      type: "Point",
      coordinates: [pickup?.lng, pickup?.lat],
      address: data.pickupAddress,
      floorNumber: data.pickupFloorNumber,
    };
    const dropoffLocation = {
      type: "Point",
      coordinates: [dropoff?.lng, dropoff?.lat],
      address: data.dropoffAddress,
      floorNumber: data.dropoffFloorNumber,
    };
    try {
      const res = await createBooking({
        pickupLocation,
        dropoffLocation,
      });
      console.log("res: ", res);
      dispatch(setBookingId(res?.data?._id));
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
        <div className="flex flex-col item-center justify-between w-[40%]">
          <h1 className="text-[32px] font-bold text-stone-800">
            Set Your Pickup & Dropoff Points
          </h1>
          <p className="text-gray-800 pt-1 text-[16px]">
            Enter your current and new address, along with floor details, to
            ensure a smooth and accurate move.
          </p>
          <form
            className="grid grid-cols-2 gap-4 w-full rounded-md pt-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              control={control}
              name="pickupLocation"
              label="Pickup Location"
              placeholder="Type or choose your location"
              setValue={setValue}
              className="py-4 text-base truncate"
              fetchSuggestions={fetchPickupSuggestions}
              suggestions={pickupSuggestions}
              onSelectSuggestion={handleSelectPickup}
              validation={{ required: "Pickup location is required" }}
              icon={Navigation}
              error={errors.pickupLocation?.message}
            />

            <Input
              control={control}
              name="pickupFloorNumber"
              type="number"
              setValue={setValue}
              label="Pickup Floor Number"
              placeholder="Type a floor number"
              className="py-4 text-base truncate"
              validation={{ required: "Pickup Floor Number is required" }}
              icon={LampFloor}
              error={errors.pickupFloorNumber?.message}
            />

            <Input
              control={control}
              name="dropoffLocation"
              label="Dropoff Location"
              placeholder="Type or choose your location"
              setValue={setValue}
              className="py-4 text-base truncate"
              fetchSuggestions={fetchDropoffSuggestions}
              suggestions={dropoffSuggestions}
              onSelectSuggestion={handleSelectDropoff}
              validation={{ required: "Dropoff location is required" }}
              icon={MapPinHouse}
              error={errors.dropoffLocation?.message}
            />
            <Input
              control={control}
              name="dropoffFloorNumber"
              type="number"
              label="Dropoff Floor Number"
              placeholder="Type a floor number"
              setValue={setValue}
              className="py-4 text-base truncate"
              validation={{ required: "Dropoff Floor Number is required" }}
              icon={LampFloor}
              error={errors.dropoffFloorNumber?.message}
            />

            <div className="flex w-full space-x-2">
              <Link
                href={"/"}
                className="border-2 border-primary text-black py-2 px-4 mt-4 font-medium"
              >
                Back to Home
              </Link>
              <Button
                type="submit"
                className="bg-primary text-white py-2 px-6 mt-4 font-medium active:scale-95 hover:opacity-90"
              >
                Next
              </Button>
            </div>
          </form>
        </div>

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
