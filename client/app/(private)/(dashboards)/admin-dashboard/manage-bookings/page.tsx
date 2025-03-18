"use client";

import { getStatusColor } from "@/app/utils/getStatusColor";
import {
  useCreateOfferMutation,
  useGetUserBookingsQuery,
  useUpdateBookingMutation,
} from "@/app/store/apis/BookingApi";
import React, { useState } from "react";
import { Loader2, XCircle, Search, Check, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/app/store/hooks";
import useFormatPrice from "@/app/hooks/ui/useFormatPrice";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";

const ManageBookings = () => {
  const { data, isLoading, error, refetch } = useGetUserBookingsQuery({});
  const [createOffer, { isLoading: createOfferLoading }] =
    useCreateOfferMutation();
  const [updateBooking, { isLoading: updateBookingLoading }] =
    useUpdateBookingMutation();

  const [search, setSearch] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [updatingOfferId, setUpdatingOfferId] = useState(null);
  const formatPrice = useFormatPrice();

  const user = useAppSelector((state) => state.auth.user);

  const filteredBookings = data?.bookings?.filter((booking: any) =>
    booking.customer?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOfferSubmit = async (bookingId: string) => {
    if (!offerPrice) return;

    try {
      await createOffer({ price: offerPrice, bookingId }).unwrap();
      setSelectedBookingId(null);
      setOfferPrice("");
      refetch(); // Refresh the bookings
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const handleUpdateBooking = async (
    bookingId,
    action,
    driverId,
    totalPrice
  ) => {
    setUpdatingOfferId(driverId);

    try {
      await updateBooking({ bookingId, action, driverId, totalPrice }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error updating booking: ", error);
    } finally {
      setUpdatingOfferId(null);
    }
  };

  return (
    <ProtectedRoute requiredRoles={["admin", "super-admin"]}>
      <main className="p-6 bg-white shadow-md rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Bookings</h2>
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search customer..."
              className="pl-10 pr-3 py-2 border rounded-md w-64 focus:ring focus:ring-indigo-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">Error fetching bookings!</p>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="th">Customer</th>
                    <th className="th">Pick-up</th>
                    <th className="th">Drop-off</th>
                    <th className="th">Move Date</th>
                    <th className="th">Status</th>
                    <th className="th">Total Price</th>
                    <th className="th">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings?.length ? (
                    filteredBookings.map((booking: any) => (
                      <React.Fragment key={booking._id}>
                        <tr className="hover:bg-gray-50">
                          <td className="td">
                            {booking.customer?.name || "N/A"}
                          </td>
                          <td className="td">
                            {booking.pickupLocation?.address}
                          </td>
                          <td className="td">
                            {booking.dropoffLocation?.address}
                          </td>
                          <td className="td">
                            {new Date(booking.moveDate).toLocaleDateString()}
                          </td>
                          <td className="td">
                            <span
                              className={`px-[10px] py-[6px] rounded-md whitespace-nowrap ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="td">
                            {booking.totalPrice
                              ? formatPrice(booking.totalPrice)
                              : "N/A"}
                          </td>
                          <td className="td text-center flex justify-center gap-3">
                            {user?.role === "driver" &&
                              (selectedBookingId === booking._id ? (
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    value={offerPrice}
                                    onChange={(e) =>
                                      setOfferPrice(e.target.value)
                                    }
                                    className="border p-1 rounded w-20"
                                    placeholder="Price"
                                  />
                                  <button
                                    className="text-green-500 hover:text-green-700"
                                    onClick={() =>
                                      handleOfferSubmit(booking._id)
                                    }
                                    disabled={createOfferLoading}
                                  >
                                    {createOfferLoading ? (
                                      <Loader2
                                        className="animate-spin"
                                        size={18}
                                      />
                                    ) : (
                                      <Check size={18} />
                                    )}
                                  </button>
                                  <button
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => setSelectedBookingId(null)}
                                  >
                                    <XCircle size={18} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="flex items-start gap-2 text-primary"
                                  onClick={() =>
                                    setSelectedBookingId(booking._id)
                                  }
                                >
                                  New offer
                                </button>
                              ))}
                            <button
                              className="flex items-center gap-2"
                              onClick={() =>
                                setExpandedBookingId(
                                  expandedBookingId === booking._id
                                    ? null
                                    : booking._id
                                )
                              }
                            >
                              Offers
                              <motion.div
                                animate={{
                                  rotate:
                                    expandedBookingId === booking._id ? 180 : 0,
                                }}
                                transition={{
                                  duration: 0.2,
                                  ease: "easeInOut",
                                }}
                              >
                                <ChevronDown size={18} />
                              </motion.div>
                            </button>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-4 text-gray-500"
                      >
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </ProtectedRoute>
  );
};

export default ManageBookings;
