"use client";
import FilterBar from "@/app/components/organisms/FilterBar";
import BookingCard from "@/app/components/sections/booking/BookingCard";
import MainLayout from "@/app/components/templates/MainLayout";
import useQueryParams from "@/app/hooks/network/useQueryParams";
import { useGetUserBookingsQuery } from "@/app/store/apis/BookingApi";
import { useForm } from "react-hook-form";

const UserBookings = () => {
  const {
    control,
    formState: { errors },
  } = useForm();
  const { query } = useQueryParams();
  console.log("query: ", query);
  const { data, error } = useGetUserBookingsQuery(query);
  console.log("data: ", data);

  if (error) {
    console.log("error: ", error);
  }

  return (
    <MainLayout>
      <FilterBar
        filterBy="status"
        sortBy="created at"
        sortOptions={["Latest Bookings", "Oldest Bookings"]}
        filterOptions={["Pending", "Accepted", "Completed", "Cancelled"]}
        control={control}
        errors={errors}
      />
      {data?.bookings.map((booking) => (
        <BookingCard
          key={booking._id}
          pickup={booking.pickupLocation}
          dropoff={booking.dropoffLocation}
          items={booking.items}
          services={booking.additionalServices}
        />
      ))}
    </MainLayout>
  );
};

export default UserBookings;
