import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Button from "@/app/components/atoms/Button";
import useToast from "@/app/hooks/ui/useToast";
import { useRouter } from "next/navigation";
import { useUpdateStepMutation } from "@/app/store/apis/DriverApi";
import { updateStep } from "@/app/store/slices/DriverSlice";

const Summary = () => {
  const { step, id, personalInfo, vehicleInfo, documents } = useAppSelector(
    (state) => state.driver
  );
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const router = useRouter();

  const [updateDriverStep] = useUpdateStepMutation();

  const submitApplication = async () => {
    try {
      await updateDriverStep({
        step: "completed",
        driverId: id,
        data: {},
      }).unwrap();
      router.push("/");
      showToast("You've successfully completed your application", "success");
    } catch (error) {
      console.error("Error updating step:", error);
      showToast("Failed to submit application. Please try again.", "error");
    }
  };

  const handleBack = () => {
    dispatch(updateStep(step - 1));
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center w-full mt-[2rem] px-4"
    >
      <div className="flex flex-col items-start justify-start gap-6 w-full max-w-2xl">
        <div className="text-center md:text-left">
          <h1 className="text-[33px] font-semibold text-stone-700">
            Review Your Application Details
          </h1>
          <p className="text-gray-600 text-[16px] mt-2">
            Make sure everything looks good before submitting your application.
            You can go back to make changes or proceed to submit.
          </p>
        </div>

        <div className="w-full space-y-6">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-medium text-stone-700 mb-3">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-2 text-gray-600">
              <p>
                <strong>Phone Number:</strong>{" "}
                {personalInfo?.phoneNumber || "N/A"}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {personalInfo?.dateOfBirth || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {personalInfo?.address || "N/A"}
              </p>
              <p>
                <strong>Gender:</strong> {personalInfo?.gender || "N/A"}
              </p>
              <p>
                <strong>Experience (Years):</strong>{" "}
                {personalInfo?.experienceYears ?? "N/A"}
              </p>
              <p>
                <strong>License Number:</strong>{" "}
                {personalInfo?.licenseInfo?.number || "N/A"}
              </p>
              <p>
                <strong>License Expiry:</strong>{" "}
                {personalInfo?.licenseInfo?.expiry || "N/A"}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-medium text-stone-700 mb-3">
              Vehicle Information
            </h2>
            <div className="grid grid-cols-1 gap-2 text-gray-600">
              <p>
                <strong>Model:</strong> {vehicleInfo?.model || "N/A"}
              </p>
              <p>
                <strong>Type:</strong> {vehicleInfo?.type || "N/A"}
              </p>
              <p>
                <strong>Plate Number:</strong>{" "}
                {vehicleInfo?.plateNumber || "N/A"}
              </p>
              <p>
                <strong>Color:</strong> {vehicleInfo?.color || "N/A"}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-medium text-stone-700 mb-3">
              Documents
            </h2>
            <div className="grid grid-cols-1 gap-2 text-gray-600">
              <p>
                <strong>Profile Picture:</strong>{" "}
                {documents?.profilePicture?.secure_url ? (
                  <a
                    href={documents.profilePicture.secure_url}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </a>
                ) : (
                  "Not Uploaded"
                )}
              </p>
              <p>
                <strong>License Image:</strong>{" "}
                {documents?.licenseImage?.secure_url ? (
                  <a
                    href={documents.licenseImage.secure_url}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </a>
                ) : (
                  "Not Uploaded"
                )}
              </p>
              <p>
                <strong>Vehicle Image:</strong>{" "}
                {documents?.vehicleImage?.secure_url ? (
                  <a
                    href={documents.vehicleImage.secure_url}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </a>
                ) : (
                  "Not Uploaded"
                )}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-between items-center w-full mt-6">
          <Button
            onClick={handleBack}
            className="border-2 border-primary text-primary py-2 px-8 font-medium hover:bg-gray-100"
          >
            Back
          </Button>
          <Button
            onClick={submitApplication}
            className="bg-primary text-white py-[10px] px-8 font-medium active:scale-95 hover:opacity-90"
          >
            Submit Application
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Summary;
