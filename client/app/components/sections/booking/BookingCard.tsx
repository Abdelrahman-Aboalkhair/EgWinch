import useFormatPrice from "@/app/hooks/ui/useFormatPrice";
import { getStatusColor } from "@/app/utils/getStatusColor";
import Image from "next/image";
import Arrow from "@/app/assets/icons/arrow.svg";
import Button from "../../atoms/Button";
import Modal from "../../organisms/Modal";
import Table from "../../organisms/Table";
import { useState } from "react";

const BookingCard = ({ key, pickup, dropoff, items, services }) => {
  const [showDetails, setShowDetails] = useState(false);

  const format = useFormatPrice();

  const itemsCols = [
    { key: "name", label: "Item" },
    { key: "quantity", label: "Qty" },
    {
      key: "fragile",
      label: "Fragile",
      render: (row) => (row.fragile ? "Yes" : "No"),
    },
    { key: "category", label: "Category" },
    { key: "additionalService", label: "Service" },
  ];

  const servicesCols = [
    { key: "name", label: "Service" },
    { key: "details", label: "Details" },
  ];

  return (
    <>
      <div
        key={key}
        className="flex flex-col items-start justify-between w-[60%] gap-4 shadow-md p-8 rounded-lg border-2 border-gray-100"
      >
        <div className="flex items-center justify-between w-full">
          <h1 className="text-sm tracking-wide font-medium text-stone-600">
            No Assigned Driver
          </h1>
          <h1 className="text-sm tracking-wide font-medium text-stone-600">
            No Incoming offers
          </h1>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <h1 className="text-[22px] font-medium">#212</h1>
            <p
              className={`${getStatusColor(
                "pending"
              )} px-2 py-1 text-[14px] font-medium rounded-md`}
            >
              Pending
            </p>
            <p className=" text-[14px]">
              {new Date().toLocaleString("en-US").split(",")[0]}
            </p>
          </div>
          <p className="text-[20px] font-semibold">
            Est price. <span className="text-primary">{format(2500)}</span>
          </p>
        </div>
        <div className="flex items-center justify-between w-full gap-8 py-4">
          <div className="w-56 text-left">
            <h1
              className="font-cairo font-semibold text-[16px] text-gray-700 leading-relaxed text-center
       break-words "
            >
              {pickup.address}
            </h1>
          </div>

          <Image
            src={Arrow}
            width={400}
            height={20}
            alt="arrow"
            className="flex-shrink-0"
          />

          <div className="w-56 text-left">
            <h1
              className="font-cairo font-semibold text-[16px] text-gray-700 leading-relaxed break-words text-center
       border-dashed "
            >
              {dropoff.address}
            </h1>
          </div>
        </div>

        <div className="flex items-center justify-between w-full text-sm">
          <div className="flex gap-2 capitalize">
            <h1>{items.length} items -</h1>
            <h1>{services.length} additional services</h1>
          </div>
          <div className="flex gap-4 capitalize items-center justify-center">
            <Button
              className="text-primary border-2 border-primary rounded-full px-4 py-2
      "
              onClick={() => setShowDetails(true)}
            >
              Move details
            </Button>
          </div>
        </div>
      </div>

      <Modal open={showDetails} onClose={() => setShowDetails(false)}>
        <div className="rounded-sm overflow-hidden w-full pb-[1rem]">
          <h1 className="text-center pb-4 text-[17px] font-medium">Items</h1>
          <Table
            data={items || []}
            columns={itemsCols}
            emptyMessage="No items added yet."
          />
        </div>

        <div className="h-[1px] bg-gray-300 w-full mt-4" />
        <div className="rounded-lg overflow-hidden w-full pt-[1rem]">
          <h1 className="text-center pb-4 text-[17px] font-medium">
            Additional Services
          </h1>
          <Table
            data={services || []}
            columns={servicesCols}
            emptyMessage="No items added yet."
          />
        </div>
      </Modal>
    </>
  );
};

export default BookingCard;
