"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Input from "../../atoms/Input";
import Map from "../../molecules/Map";
import { Navigation, ChevronDown } from "lucide-react";
import DatePicker from "../../molecules/DatePicker";
import { useCreateBookingMutation } from "../../../store/apis/BookingApi";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../../store/hooks";
import { addToast } from "../../../store/slices/ToastSlice";
import ApartmentDetailsForm from "./ApartmentDetailsForm";

const BookMove = () => {
  const { register, handleSubmit, control } = useForm();
  const [items, setItems] = useState([]);
  const [showApartmentForm, setShowApartmentForm] = useState(false);

  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
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

  const addItem = (newItem) => {
    setItems([...items, newItem]);
  };

  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, updatedItem) => {
    setItems(items.map((item, i) => (i === index ? updatedItem : item)));
  };

  return (
    <>
      <main className="flex items-center justify-between w-full min-h-screen">
        <div className="flex flex-col items-start justify-center gap-4 w-[30%]">
          <h1 className="text-[33px] font-bold w-[40rem] mb-2">
            Move Smart, Move Easy with
            <span className="text-primary ml-2">EgWinch</span>
          </h1>

          <form
            className="flex flex-col items-start justify-start gap-3 w-full"
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
                icon={Navigation}
                value={pickupAddress || ""}
                onChange={() => {}}
              />
            </div>

            <Input
              name="dropoffLocation"
              placeholder="Enter Dropoff Location"
              register={register}
              className="py-[15px] text-[16px] truncate"
              value={dropoffAddress || ""}
              onChange={() => {}}
            />
            <DatePicker
              name="moveDate"
              control={control}
              label="When are you moving?"
            />

            <button
              type="button"
              onClick={() => setShowApartmentForm(!showApartmentForm)}
              className="flex items-center justify-center gap-2 text-white bg-primary px-4 py-[12px] rounded-lg mt-4"
            >
              Apartment details
              <motion.div
                animate={{ rotate: showApartmentForm ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={19} />
              </motion.div>
            </button>
          </form>
        </div>

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
      </main>

      {showApartmentForm && (
        <ApartmentDetailsForm
          register={register}
          items={items}
          addItem={addItem}
          deleteItem={deleteItem}
          updateItem={updateItem}
        />
      )}
    </>
  );
};

export default BookMove;
