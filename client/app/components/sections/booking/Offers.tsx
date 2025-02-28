import { getStatusColor } from "@/app/utils/getStatusColor";
import useFormatPrice from "@/app/hooks/useFormatPrice";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const Offers = ({
  booking,
  expandedBookingId,
  handleUpdateBooking,
  updatingOfferId,
}: any) => {
  const formatPrice = useFormatPrice();
  return (
    <>
      {/* Offers Section */}
      {expandedBookingId === booking._id && (
        <tr>
          <td colSpan={7} className="p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {booking.offers?.length > 0 ? (
                booking.offers.map((offer: any) => (
                  <div
                    key={offer._id}
                    className="bg-white p-4 rounded-lg shadow-md border"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        {formatPrice(offer.price)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          offer.status
                        )}`}
                      >
                        {offer.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">
                      {offer?.status === "pending"
                        ? "Incoming offer from"
                        : offer?.status === "declined"
                        ? "Declined offer from"
                        : "An offer was accepted from"}
                      <span className="text-primary font-medium ml-1">
                        {offer.driver?.name}
                      </span>
                    </p>
                    {offer?.status !== "accepted" && (
                      <button
                        className="mt-2 bg-primary text-white px-4 py-2 rounded"
                        onClick={() =>
                          handleUpdateBooking(
                            booking._id,
                            "accept",
                            offer.driver,
                            offer.price
                          )
                        }
                        disabled={updatingOfferId === offer.driver}
                      >
                        {updatingOfferId === offer.driver ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          "Accept"
                        )}
                      </button>
                    )}

                    <div className="flex space-x-2 my-4">
                      {" "}
                      <Link href={`/profile/${offer.driver._id}`}>
                        <button className="bg-secondary px-[12px] text-black rounded-md py-[6px] text-[15px] font-medium">
                          View Driver Profile
                        </button>
                      </Link>
                      <Link href={`/chat/${offer.driver._id}`}>
                        <button className="bg-primary px-[12px] text-white rounded-md py-[6px] text-[15px] font-medium">
                          Contact {offer.driver.name}
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No offers yet.</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default Offers;
