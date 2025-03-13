import { useState } from "react";
import { motion } from "framer-motion";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Button from "@/app/components/atoms/Button";
import Modal from "@/app/components/organisms/Modal";
import { updateStep } from "@/app/store/slices/BookingSlice";
import { getStatusColor } from "@/app/utils/getStatusColor";
import useFormatPrice from "@/app/hooks/useFormatPrice";
import Arrow from "@/app/assets/icons/arrow.svg";
import Image from "next/image";
import Table from "@/app/components/organisms/Table";
import { ArrowBigRight } from "lucide-react";
import { useUpdateOnboardingStepMutation } from "@/app/store/apis/BookingApi";
import useToast from "@/app/hooks/useToast";
import { useRouter } from "next/navigation";

const Summary = () => {
  const { step, pickup, dropoff, moveDate, items, services, bookingId } =
    useAppSelector((state) => state.booking);
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const router = useRouter();

  const [updateOnboardingStep] = useUpdateOnboardingStepMutation();

  const [showDetails, setShowDetails] = useState(false);

  const createBooking = async () => {
    try {
      await updateOnboardingStep({
        bookingId,
        step: "completed",
      });
      router.push("/bookings");
      showToast("Booking created successfully", "success");
    } catch (error) {
      console.error("Error updating step:", error);
    }
  };

  const handleBack = () => {
    dispatch(updateStep(step - 1));
  };

  const format = useFormatPrice();

  const itemsCols = [
    { key: "name", label: "Item" },
    { key: "quantity", label: "Qty" },
    {
      key: "fragile",
      label: "Fragile",
      render: (row: ItemProps) => (row.fragile ? "Yes" : "No"),
    },
    { key: "category", label: "Category" },
    { key: "additionalService", label: "Service" },
  ];

  const servicesCols = [
    { key: "name", label: "Service" },
    { key: "details", label: "Details" },
  ];

  const navigateToItems = () => {
    dispatch(updateStep(2));
  };

  const navigateToServices = () => {
    dispatch(updateStep(3));
  };

  return (
    <OnboardingLayout currentStep={step}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center w-full"
      >
        <div className="flex flex-col items-start justify-between w-[50%] gap-4 shadow-md p-8 rounded-lg">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <h1 className="text-[22px] font-medium">#212</h1>
              <p
                className={`${getStatusColor(
                  "pending"
                )} px-2 py-1 text-[14px] font-medium rounded-md`}
              >
                Pending
              </p>
              <p className="font-medium text-[16px]">
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
                className="font-cairo font-semibold text-[16px] text-gray-700 leading-relaxed
               break-words "
              >
                {pickup.address}
              </h1>
            </div>

            <Image
              src={Arrow}
              width={300}
              height={20}
              alt="arrow"
              className="flex-shrink-0"
            />

            <div className="w-56 text-left">
              <h1
                className="font-cairo font-semibold text-[16px] text-gray-700 leading-relaxed break-words
               border-dashed "
              >
                {dropoff.address}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2 capitalize">
              <h1>{items.length} items -</h1>
              <h1>{services.length} additional services</h1>
            </div>
            <Button onClick={() => setShowDetails(true)}>Show details</Button>
          </div>
        </div>

        <Modal open={showDetails} onClose={() => setShowDetails(false)}>
          <div className="rounded-sm overflow-hidden w-full pb-[1rem]">
            <h1 className="text-center pb-4 text-[17px] font-medium">
              Items summary
            </h1>
            <Table
              data={items || []}
              columns={itemsCols}
              emptyMessage="No items added yet."
            />
          </div>
          <Button
            onClick={navigateToItems}
            className="flex items-center justify-center gap-2 mt-4 hover:bg-opacity-90 px-4 border-2 border-primary"
          >
            Navigate to Items
            <ArrowBigRight size={18} />
          </Button>

          <div className="h-[1px] bg-gray-300 w-full mt-4" />
          <div className="rounded-lg overflow-hidden w-full pt-[1rem]">
            <h1 className="text-center pb-4 text-[17px] font-medium">
              Services summary
            </h1>
            <Table
              data={services || []}
              columns={servicesCols}
              emptyMessage="No items added yet."
            />
          </div>

          <Button
            onClick={navigateToServices}
            className="flex items-center justify-center gap-2 mt-4 hover:bg-opacity-90 px-4 border-2 border-primary"
          >
            Navigate to Services
            <ArrowBigRight size={18} />
          </Button>
        </Modal>
      </motion.div>

      <div className="flex justify-center items-center mt-6 gap-2">
        <Button
          onClick={handleBack}
          className="border-2 border-primary text-black py-2 px-8 font-medium"
        >
          Back
        </Button>
        <Button
          onClick={createBooking}
          className="bg-primary text-white py-[10px] px-8 font-medium active:scale-95 hover:opacity-90"
        >
          Save & Create
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default Summary;
