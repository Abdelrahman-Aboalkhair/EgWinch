import { ChevronUp, ChevronDown } from "lucide-react";

const Offers = ({
  booking,
  expandedBookingId,
  setExpandedBookingId,
}: {
  booking: any;
  expandedBookingId: any;
  setExpandedBookingId: any;
}) => {
  return (
    <>
      <button
        className="flex items-center gap-2"
        onClick={() =>
          setExpandedBookingId(
            expandedBookingId === booking._id ? null : booking._id
          )
        }
      >
        Offers
        {expandedBookingId === booking._id ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </button>
      {expandedBookingId === booking._id && (
        <tr>
          <td colSpan={7} className="p-4 bg-gray-100">
            <strong>Offers:</strong>
            {booking.offers?.length > 0 ? (
              <ul className="mt-2">
                {booking.offers.map((offer) => (
                  <li
                    key={offer._id}
                    className="text-gray-700 flex items-center gap-2 space-y-2"
                  >
                    <span>${offer.price}</span> -<span>{offer.driver}</span> -
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
              <p className="text-gray-500 mt-2">No offers yet.</p>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

export default Offers;
