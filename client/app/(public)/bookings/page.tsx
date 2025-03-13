"use client";
import Table from "@/app/components/organisms/Table";
import { useGetUserBookingsQuery } from "@/app/store/apis/BookingApi";
import React from "react";

const Bookings = () => {
  const { data, isLoading, error } = useGetUserBookingsQuery({});
  console.log("error => ", error);
  console.log("data => ", data);
  const columns = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "pickup",
      label: "Pickup",
    },
    {
      key: "dropoff",
      label: "Dropoff",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "totalPrice",
      label: "Total Price",
    },
  ];
  return <main></main>;
};

export default Bookings;
