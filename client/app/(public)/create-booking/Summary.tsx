import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Package, Wrench, ArrowRight } from "lucide-react";
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center gap-6"
      >
        <Card className="w-full max-w-md shadow-md bg-white/80 backdrop-blur-lg">
          <div className="flex flex-row items-center gap-3 p-4">
            <Calendar className="text-primary w-6 h-6" />
            <h3 className="text-lg font-semibold">
              {moveDate ? new Date(moveDate).toLocaleDateString() : "Not set"}
            </h3>
          </div>
        </Card>

        <Card className="w-full max-w-md shadow-md bg-white/80 backdrop-blur-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <MapPin className="text-green-600" size={50} />
              <div>
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="font-semibold">{pickup.address || "Not set"}</p>
              </div>
            </div>

            <motion.div
              initial={{ x: -10 }}
              animate={{ x: 0 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1,
              }}
            >
              <ArrowRight className="text-gray-600 w-6 h-6" />
            </motion.div>

            <div className="flex items-center gap-2 text-right">
              <div>
                <p className="text-xs text-gray-500">Dropoff</p>
                <p className="font-semibold">{dropoff.address || "Not set"}</p>
              </div>
              <MapPin className="text-red-600" size={50} />
            </div>
          </div>
          <Button
            onClick={() => setShowDetails(true)}
            className="w-full max-w-md"
          >
            Show Move Details
          </Button>
        </Card>

        <Modal open={showDetails} onClose={() => setShowDetails(false)}>
          <h2 className="text-xl font-semibold mb-4">Move Details</h2>
          <div className="space-y-3">
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
            <p className="flex items-center gap-2">
              <Package className="text-blue-600 w-5 h-5" />
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
            <p className="flex items-center gap-2">
              <Wrench className="text-yellow-600" size={20} />
              <strong>Services:</strong>{" "}
              {services.length > 0 ? services.join(", ") : "None"}
            </p>
          </div>
          <Button className="w-full mt-4" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal>
      </motion.div>

      <div className="flex justify-center mt-6 gap-3">
        <Button onClick={handleBack}>Back</Button>
        <Button className="bg-primary text-white px-4">Create Booking</Button>
      </div>
    </OnboardingLayout>
  );
};

export default Summary;
