"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../atoms/Input";
import Map from "../../molecules/Map";
import { MapPinPlus, Navigation } from "lucide-react";
import DatePicker from "../../molecules/DatePicker";
import ItemsList from "./ItemsList";
import { useCreateBookingMutation } from "../../../store/apis/BookingApi";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../../store/hooks";
import { addToast } from "../../../store/slices/ToastSlice";

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
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [createBooking, { isLoading, error }] = useCreateBookingMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onSubmit = async (data) => {
    data.pickupLocation = pickup;
    data.dropoffLocation = dropoff;
    data.items = items;
    console.log("submitted data: ", data);
    try {
      const res = await createBooking(data).unwrap();
      console.log("res: ", res);
      dispatch(
        addToast({ message: "Booking created successfully", type: "success" })
      );
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
          <div className="relative w-full col-span-2">
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
          </div>

          <div className="relative w-full col-span-2">
            <Input
              name="dropoffLocation"
              placeholder="Enter Dropoff Location"
              register={register}
              className="py-[15px] text-[16px] truncate"
              icon={Navigation}
              value={dropoffAddress || ""}
              onChange={() => {}}
            />
          </div>
          <DatePicker name="moveDate" control={control} label="Move In Date" />

          <ItemsList
            items={items}
            setItems={setItems}
            register={register}
            control={control}
          />
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
