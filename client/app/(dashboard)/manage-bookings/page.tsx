"use client";
import { getStatusColor } from "@/app/helpers/getStatusColor";
import { useGetBookingsQuery } from "@/app/libs/features/apis/BookingApi";
import React from "react";

const ManageBookings = () => {
  const { data, isLoading, error } = useGetBookingsQuery({});

  if (isLoading) return <p>Loading bookings...</p>;
  if (error) return <p>Error fetching bookings!</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Manage Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Pickup</th>
              <th className="border p-2">Drop-off</th>
              <th className="border p-2">Move Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Total Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.bookings?.map((booking: any) => (
              <tr key={booking._id} className="border">
                <td className="border p-2">
                  {booking.customer?.name || "N/A"}
                </td>
                <td className="border p-2">
                  {booking.pickupLocation?.address}
                </td>
                <td className="border p-2">
                  {booking.dropoffLocation?.address}
                </td>
                <td className="border p-2">
                  {new Date(booking.moveDate).toLocaleDateString()}
                </td>
                <td
                  className={`border p-2 font-bold ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </td>
                <td className="border p-2">
                  {booking.totalPrice ? `$${booking.totalPrice}` : "N/A"}
                </td>
                <td className="border p-2 flex gap-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded">
                    View
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded">
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
