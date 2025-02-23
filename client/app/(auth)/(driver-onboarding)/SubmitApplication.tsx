import { useSubmitForReviewMutation } from "@/app/libs/features/apis/DriverApi";
import { useAppSelector } from "@/app/libs/hooks";
import React from "react";

const SubmitApplication = () => {
  const [submitApplication, { data, error, isLoading }] =
    useSubmitForReviewMutation();
  const { step } = useAppSelector((state) => state.driverOnboarding);

  const handleSubmitPersonalInfo = async (data) => {
    const formData = new FormData();
    // personal info
    formData.append("address", data.address);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("gender", data.gender);
    formData.append("experienceYears", data.experienceYears.toString());
    try {
      await submitApplication(data).unwrap();
    } catch (error) {
      console.error("Application start error:", error);
    }
  };
  return <div>SubmitApplication</div>;
};

export default SubmitApplication;
