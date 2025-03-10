import { useState } from "react";
import { ArrowRight } from "lucide-react";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Button from "@/app/components/atoms/Button";
import Card from "@/app/components/molecules/Card";
import Modal from "@/app/components/organisms/Modal";
import { updateStep } from "@/app/store/slices/BookingSlice";

const Summary = () => {
  const { step, pickup, dropoff, moveDate, items, services } = useAppSelector(
    (state) => state.booking
  );
  const dispatch = useAppDispatch();

  const [showDetails, setShowDetails] = useState(false);

  const handleBack = () => {
    dispatch(updateStep(step - 1));
  };
  return (
    <OnboardingLayout currentStep={step}>
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Move Date */}
        <Card className="w-full max-w-md text-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Move Date:{" "}
            {moveDate ? new Date(moveDate).toLocaleDateString() : "Not set"}
          </h2>
        </Card>

        {/* Pickup & Dropoff Summary */}
        <Card className="w-full max-w-md flex items-center justify-between">
          {/* Pickup */}
          <div className="text-left">
            <span className="text-gray-500 text-sm">Pickup</span>
            <h3 className="font-semibold">{pickup.address || "Not set"}</h3>
          </div>

          {/* Arrow */}
          <ArrowRight className="text-gray-600 w-6 h-6" />

          {/* Dropoff */}
          <div className="text-right">
            <span className="text-gray-500 text-sm">Dropoff</span>
            <h3 className="font-semibold">{dropoff.address || "Not set"}</h3>
          </div>
        </Card>

        {/* Show Details Button */}
        <Button
          onClick={() => setShowDetails(true)}
          className="w-full max-w-md"
        >
          Show Move Details
        </Button>

        {/* Move Details Modal */}
        <Modal open={showDetails} onClose={() => setShowDetails(false)}>
          <h2 className="text-xl font-semibold mb-4">Move Details</h2>
          <p>
            <strong>Move Date:</strong>{" "}
            {moveDate ? new Date(moveDate).toLocaleString() : "Not set"}
          </p>
          <p>
            <strong>Pickup:</strong> {pickup.address || "Not set"} (Floor:{" "}
            {pickup.floorNumber})
          </p>
          <p>
            <strong>Dropoff:</strong> {dropoff.address || "Not set"} (Floor:{" "}
            {dropoff.floorNumber})
          </p>
          <p>
            <strong>Items:</strong>{" "}
            {items.length > 0
              ? items.map((item, i) => (
                  <span key={i}>
                    {item.quantity}x {item.name}{" "}
                    {item.fragile ? "(Fragile)" : ""}
                    {i < items.length - 1 ? ", " : ""}
                  </span>
                ))
              : "No items added"}
          </p>
          <p>
            <strong>Services:</strong>{" "}
            {services.length > 0 ? services.join(", ") : "None"}
          </p>

          <Button className="mt-4 w-full" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal>
      </div>
      <div className="flex justify-center mt-6 gap-2">
        <button
          type="button"
          onClick={handleBack}
          className="border-2 border-primary text-black py-2 px-10 font-medium"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-primary text-white py-[10px] px-12 font-medium active:scale-95 hover:opacity-90"
        >
          Next
        </button>
      </div>
    </OnboardingLayout>
  );
};

export default Summary;
