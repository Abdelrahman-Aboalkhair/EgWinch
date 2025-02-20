"use client";
import { getStatusColor } from "@/app/helpers/getStatusColor";
import {
  useCreateOfferMutation,
  useGetBookingsQuery,
} from "@/app/libs/features/apis/BookingApi";
import { useState } from "react";
import {
  Loader2,
  Eye,
  XCircle,
  Search,
  DollarSign,
  Check,
  BadgeCent,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/app/libs/hooks";

const ManageBookings = () => {
  const { data, isLoading, error } = useGetBookingsQuery({});
  const [createOffer, { isLoading: createOfferLoading }] =
    useCreateOfferMutation();
  const [search, setSearch] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [expandedBookingId, setExpandedBookingId] = useState(null);

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
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  return (
    <main className="p-6 bg-white shadow-md rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Bookings</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
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
              {/* Table Head */}
              <thead className="bg-gray-100">
                <tr>
                  <th className="th">Customer</th>
                  <th className="th">Pickup</th>
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
                    <>
                      <tr key={booking._id} className="hover:bg-gray-50">
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
                        <td
                          className={`td font-bold ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </td>
                        <td className="td">
                          {booking.totalPrice
                            ? `$${booking.totalPrice}`
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
                                  onClick={() => handleOfferSubmit(booking._id)}
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
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() =>
                              setExpandedBookingId(
                                expandedBookingId === booking._id
                                  ? null
                                  : booking._id
                              )
                            }
                          >
                            <BadgeCent size={18} />
                          </button>
                        </td>
                      </tr>
                      {expandedBookingId === booking._id && (
                        <>
                          {console.log(
                            "Expanded booking ID:",
                            expandedBookingId,
                            "Offers:",
                            booking.offers
                          )}
                          <tr>
                            <td colSpan={7} className="p-4 bg-gray-100">
                              <strong>Offers:</strong>
                              {booking.offers?.length > 0 ? (
                                <ul className="mt-2">
                                  {booking.offers.map((offer: any) => (
                                    <li
                                      key={offer._id}
                                      className="text-gray-700 flex items-center gap-2 space-y-2"
                                    >
                                      <span>${offer.price}</span> -
                                      <span>{offer.driver}</span> -
                                      <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${
                                          offer.status === "pending"
                                            ? "bg-yellow-200 text-yellow-800"
                                            : offer.status === "negotiating"
                                            ? "bg-blue-200 text-blue-800"
                                            : offer.status === "accepted"
                                            ? "bg-green-200 text-green-800"
                                            : "bg-red-200 text-red-800"
                                        }`}
                                      >
                                        {offer.status}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-500 mt-2">
                                  No offers yet.
                                </p>
                              )}
                            </td>
                          </tr>
                        </>
                      )}
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
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
  );
};

export default ManageBookings;
