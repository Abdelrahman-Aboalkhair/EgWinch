"use client";
import Input from "@/app/components/custom/Input";
import { useVerifyEmailMutation } from "@/app/libs/features/apis/AuthApi";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const VerifyEmail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [verifyEmail, { error, isLoading }] = useVerifyEmailMutation();
  const router = useRouter();

  const onSubmit = async (data) => {
    console.log("Submitted data:", data);
    try {
      const result = await verifyEmail({
        emailVerificationToken: data.emailVerificationToken,
      }).unwrap();
      console.log("Verification result:", result);

      if (result.success) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error occurred while verifying email", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Verify Your Email
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Please enter the verification code sent to your email.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            name="emailVerificationToken"
            type="text"
            placeholder="Enter Verification Code"
            register={register}
            className="py-3 px-4 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-md hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
