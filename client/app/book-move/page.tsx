"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/custom/Input";
import Map from "../components/home/Map";
import { MapPinPlus, Navigation } from "lucide-react";
import DatePicker from "../components/custom/DatePicker";
import ItemsList from "../components/booking/ItemsList";
import { useCreateBookingMutation } from "../libs/features/apis/BookingApi";
import { useRouter } from "next/navigation";

interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number];
  address: string;
}

const BookMove = () => {
  const { register, handleSubmit, control } = useForm();
  const [items, setItems] = useState([]);

  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [pickup, setPickup] = useState<GeoJSONPoint | null>(null);
  const [dropoff, setDropoff] = useState<GeoJSONPoint | null>(null);
  const [showPickupTooltip, setShowPickupTooltip] = useState(false);
  const [showDropoffTooltip, setShowDropoffTooltip] = useState(false);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [createBooking, { isLoading, error }] = useCreateBookingMutation();
  const router = useRouter();

  const onSubmit = async (data) => {
    data.pickupLocation = pickup;
    data.dropoffLocation = dropoff;
    data.items = items;
    console.log("submitted data: ", data);
    try {
      await createBooking(data).unwrap();
      console.log("booking created");
      router.push("/manage-bookings");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const onSetPickup = (pickupPosition: LatLng) => {
    setPickup({
      type: "Point",
      coordinates: [pickupPosition.lng, pickupPosition.lat],
      address: pickupAddress,
    });
  };

  const onSetDropoff = (dropoffPosition: LatLng) => {
    setDropoff({
      type: "Point",
      coordinates: [dropoffPosition.lng, dropoffPosition.lat],
      address: dropoffAddress,
    });
  };

  return (
    <main className="flex items-center justify-between min-h-screen px-[10rem]">
      <div className="flex flex-col items-start justify-center gap-4 w-[40%]">
        <form
          className="grid grid-cols-2 gap-4 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div
            className="relative w-full col-span-2"
            onMouseEnter={() => setShowPickupTooltip(true)}
            onMouseLeave={() => setShowPickupTooltip(false)}
          >
            {pickup && dropoff && (
              <li className="capitalize text-[15px] font-medium mb-2">
                Your route is{" "}
                <span className="text-primary font-semibold">
                  {routeDistance?.toFixed(2) || 0} km
                </span>
                , which is approximately{" "}
                <span className="text-primary font-semibold">
                  {routeDuration?.toFixed(2) || 0} minutes
                </span>{" "}
              </li>
            )}
            <Input
              name="pickupLocation"
              placeholder="Enter Pickup Location"
              register={register}
              className="py-[15px] text-[16px] truncate"
              icon={MapPinPlus}
              value={pickupAddress || ""}
              onChange={() => {}}
            />
            {/* {showPickupTooltip && pickup && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: -125 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 -bottom-7 capitalize text-[15px] bg-gray-800 text-white px-4 py-[14px] rounded shadow-md"
              >
                Your Pickup is at {pickup}
              </motion.span>
            )} */}
          </div>

          <div
            className="relative w-full col-span-2"
            onMouseEnter={() => setShowDropoffTooltip(true)}
            onMouseLeave={() => setShowDropoffTooltip(false)}
          >
            <Input
              name="dropoffLocation"
              placeholder="Enter Dropoff Location"
              register={register}
              className="py-[15px] text-[16px] truncate"
              icon={Navigation}
              value={dropoffAddress || ""}
              onChange={() => {}}
            />
            {/* {showDropoffTooltip && dropoff && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: -195 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 -bottom-7 capitalize text-[15px] bg-gray-800 text-white px-4 py-[14px] rounded shadow-md"
              >
                Your Dropoff is at {dropoff}
              </motion.span>
            )} */}
          </div>
          <DatePicker name="moveDate" control={control} label="Move In Date" />

          <div className="col-span-2">
            <ItemsList
              items={items}
              setItems={setItems}
              register={register}
              control={control}
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white py-[12px] w-full "
          >
            Submit Booking
          </button>
        </form>
      </div>

      <Map
        pickup={pickup}
        dropoff={dropoff}
        setPickupAddress={setPickupAddress}
        setDropoffAddress={setDropoffAddress}
        onSetPickup={onSetPickup}
        onSetDropoff={onSetDropoff}
        setPickup={setPickup}
        setDropoff={setDropoff}
        setRouteDistance={setRouteDistance}
        setRouteDuration={setRouteDuration}
      />
    </main>
  );
};

export default BookMove;
