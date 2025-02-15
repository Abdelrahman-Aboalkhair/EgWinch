"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/custom/Input";
import Map from "../components/home/Map";
import { MapPinPlus, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import DatePicker from "../components/custom/DatePicker";
import Dropdown from "../components/custom/Dropdown";

const BookMove = () => {
  const { register, handleSubmit, control } = useForm();
  const [additionalServicesOptions, setAdditionalServicesOptions] = useState<
    string[]
  >(["Option 1", "Option 2", "Option 3"]);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [showPickupTooltip, setShowPickupTooltip] = useState(false);
  const [showDropoffTooltip, setShowDropoffTooltip] = useState(false);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);

  const onSubmit = (data) => {
    setPickup(data.pickup);
    setDropoff(data.dropoff);
  };

  const onSetPickup = (pickupPosition) => {
    setPickup(`${pickupPosition.lat}, ${pickupPosition.lng}`);
  };

  const onSetDropoff = (dropoffPosition) => {
    setDropoff(`${dropoffPosition.lat}, ${dropoffPosition.lng}`);
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
              name="pickup"
              placeholder="Enter Pickup Location"
              register={register}
              className="py-[15px] text-[16px] truncate"
              icon={MapPinPlus}
              value={pickup}
              onChange={setPickup}
            />
            {showPickupTooltip && pickup && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: -125 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 -bottom-7 capitalize text-[15px] bg-gray-800 text-white px-4 py-[14px] rounded shadow-md"
              >
                Your Pickup is at {pickup}
              </motion.span>
            )}
          </div>

          <div
            className="relative w-full col-span-2"
            onMouseEnter={() => setShowDropoffTooltip(true)}
            onMouseLeave={() => setShowDropoffTooltip(false)}
          >
            <Input
              name="dropoff"
              placeholder="Enter Dropoff Location"
              register={register}
              className="py-[15px] text-[16px] truncate"
              icon={Navigation}
              value={dropoff}
              onChange={setDropoff}
            />
            {showDropoffTooltip && dropoff && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: -195 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 -bottom-7 capitalize text-[15px] bg-gray-800 text-white px-4 py-[14px] rounded shadow-md"
              >
                Your Dropoff is at {dropoff}
              </motion.span>
            )}
          </div>
          <DatePicker name="moveDate" control={control} label="Move In Date" />

          <Dropdown
            className="w-full"
            key={"bedroomsNumber"}
            options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
            label="Additional Services"
            onClear={() => setAdditionalServicesOptions([])}
            onSelect={setAdditionalServicesOptions}
          />
        </form>
      </div>

      <Map
        pickup={pickup}
        dropoff={dropoff}
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
