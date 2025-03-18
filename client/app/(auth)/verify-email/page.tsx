"use client";
import OtpInput from "@/app/components/molecules/Otp";
import useToast from "@/app/hooks/ui/useToast";
import { useVerifyEmailMutation } from "@/app/store/apis/AuthApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

const VerifyEmail = () => {
  const { showToast } = useToast();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [otp, setOtp] = useState();
  const router = useRouter();

  const handleVerifyEmail = async () => {
    try {
      const result = await verifyEmail({ emailVerificationCode: otp }).unwrap();
      console.log("Verification result:", result);

      if (result.success) {
        showToast(result.message, "success");
        router.push("/");
      }
    } catch (error) {
      showToast(`${error?.data?.message || "An error occurred"}`, "error");
      console.error("Error occurred while verifying email", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[75vh]">
      <div className="space-y-2 pb-6">
        <h1 className="text-[40px] font-bold text-center text-gray-800 tracking-wider">
          Please check your email
        </h1>
        <p className="text-center text-gray-600 text-[17px]">
          We’ve sent you a 4 digit code to abdelrahman.aboalkhair1@gmail.com
        </p>
      </div>
      <OtpInput setOtp={setOtp} />
      <button
        className="w-[27%] py-3 bg-primary text-white rounded-md hover:opacity-90 mt-4"
        disabled={isLoading}
        onClick={handleVerifyEmail}
      >
        {isLoading ? "Verifying..." : "Verify your email"}
      </button>
    </main>
  );
};

export default VerifyEmail;
