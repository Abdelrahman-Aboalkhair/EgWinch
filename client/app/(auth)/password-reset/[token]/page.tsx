"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@/app/components/atoms/Input";
import Button from "@/app/components/atoms/Button";
import { useResetPasswordMutation } from "@/app/store/apis/AuthApi";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  params: {
    token: string;
  };
}

const PasswordResetWithToken = () => {
  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { token } = useParams();
  const [resetPassword, { data, error, isLoading }] =
    useResetPasswordMutation();
  const [message, setMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (formData: {
    password: string;
    confirmPassword: string;
  }) => {
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await resetPassword({
        token,
        newPassword: formData.password,
      }).unwrap();
      console.log("res: ", res);
    } catch (err) {
      setMessage(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-[500px] gap-4"
      >
        <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>

        {message && (
          <div
            className={`px-4 py-2 mb-4 rounded ${
              error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <Input
          type="password"
          name="password"
          placeholder="New Password"
          control={control}
          validation={{
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          }}
          className="py-4"
        />

        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          control={control}
          validation={{ required: "Confirm your password" }}
          className="py-4"
        />

        <Button
          type="submit"
          className="bg-primary mt-4 text-white w-full py-[12px] rounded"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>

        <Link className="mt-4 hover:underline" href={"/sign-in"}>
          Return to sign in
        </Link>
      </form>
    </div>
  );
};

export default PasswordResetWithToken;
