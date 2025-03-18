"use client";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  setBookingId,
  updateLocations,
  updateStep,
} from "@/app/store/slices/BookingSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Input from "@/app/components/atoms/Input";
import { useCreateBookingMutation } from "@/app/store/apis/BookingApi";
import { LampFloor, Loader2, MapPinHouse, Navigation } from "lucide-react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import useLocationSuggestions from "@/app/hooks/miscellaneous/useGetLocationSuggestions";
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
    <>
      <div className="flex flex-col md:flex-row gap-6 w-full items-center justify-between">
        <div className="flex flex-col item-center justify-between w-[40%]">
          <h1 className="text-[32px] font-semibold text-stone-700">
            Where Are You Moving From & To?
          </h1>

          <form
            className="grid grid-cols-3 gap-4 w-full rounded-md pt-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="col-span-2">
              <Input
                control={control}
                name="pickupLocation"
                label="Pick-up Location"
                placeholder="Enter or select your location on the map"
                setValue={setValue}
                className="py-4 text-base truncate"
                fetchSuggestions={fetchPickupSuggestions}
                suggestions={pickupSuggestions}
                onSelectSuggestion={handleSelectPickup}
                validation={{ required: "Pickup location is required" }}
                icon={Navigation}
                error={errors.pickupLocation?.message}
              />
            </div>

            <Input
              control={control}
              name="pickupFloorNumber"
              type="number"
              setValue={setValue}
              label="Floor Number"
              placeholder="Type a floor number"
              className="py-4 text-base truncate"
              validation={{ required: "Pickup Floor Number is required" }}
              icon={LampFloor}
              error={errors.pickupFloorNumber?.message}
            />

            <div className="col-span-2">
              <Input
                control={control}
                name="dropoffLocation"
                label="Drop-off Location"
                placeholder="Enter or select your location on the map"
                setValue={setValue}
                className="py-4 text-base truncate"
                fetchSuggestions={fetchDropoffSuggestions}
                suggestions={dropoffSuggestions}
                onSelectSuggestion={handleSelectDropoff}
                validation={{ required: "Dropoff location is required" }}
                icon={MapPinHouse}
                error={errors.dropoffLocation?.message}
              />
            </div>

            <Input
              control={control}
              name="dropoffFloorNumber"
              label="Floor Number"
              type="number"
              placeholder="Type a floor number"
              setValue={setValue}
              className="py-4 text-base truncate"
              validation={{ required: "Dropoff Floor Number is required" }}
              icon={LampFloor}
              error={errors.dropoffFloorNumber?.message}
            />

            <div className="flex w-full space-x-2 col-span-3">
              <Link
                href={"/"}
                className="border-2 border-primary text-primary py-2 px-4 mt-4 font-medium"
              >
                Back to Home
              </Link>
              <Button
                type="submit"
                className="bg-primary text-white py-2 px-6 mt-4 font-medium active:scale-95 hover:opacity-90"
              >
                Continue
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
    </>
  );
};

export default Location;
