"use client";
import { useForm } from "react-hook-form";
import Input from "@/app/components/atoms/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import GoogleSignup from "../(oAuth)/google/GoogleSignup";
import useToast from "@/app/hooks/ui/useToast";
import { useState } from "react";
import AuthLayout from "@/app/components/templates/AuthLayout";
import PasswordField from "@/app/components/molecules/PasswordField";
import { z } from "zod";
import { useSignupMutation } from "@/app/store/apis/AuthApi";

interface InputForm {
  name: string;
  email: string;
  password: string;
}

const nameSchema = (value: string) => {
  const result = z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .safeParse(value);
  return result.success || result.error.errors[0].message;
};

const emailSchema = (value: string) => {
  const result = z.string().email("Invalid email address").safeParse(value);
  return result.success || result.error.errors[0].message;
};

const Signup = () => {
  const { showToast } = useToast();
  const [signup, { error, isLoading }] = useSignupMutation();
  const [resultError, setResultError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: InputForm) => {
    setResultError(null);
    try {
      const result = await signup(data).unwrap();
      if (result.success) {
        showToast(result.message, "success");
        router.push("/");
      }
    } catch (error) {
      console.log("signup error:", error);
      setResultError(error.data?.message || "An unexpected error occurred");
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-3xl p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Sign up
        </h2>
        {(error || googleError || resultError) && (
          <div className="bg-red-100 border border-red-400 text-center text-red-700 w-full px-4 py-[18px] rounded relative mb-4">
            <span className="block sm:inline">
              {resultError ||
                error?.data?.message ||
                googleError ||
                "An unexpected error occurred"}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <Input
            name="name"
            type="text"
            placeholder="Name"
            control={control}
            validation={{ required: "Name is required", validate: nameSchema }}
            error={errors.name?.message}
            className="py-[18px]"
          />

          <Input
            name="email"
            type="text"
            placeholder="Email"
            control={control}
            validation={{
              required: "Email is required",
              validate: emailSchema,
            }}
            error={errors.email?.message}
            className="py-[18px]"
          />

          <PasswordField register={register} watch={watch} errors={errors} />

          <button
            type="submit"
            className={`flex items-center justify-center w-full mx-auto py-[16px] bg-primary text-white rounded font-medium hover:opacity-90 ${
              isLoading ? "cursor-not-allowed bg-gray-400 text-gray-800" : ""
            }`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-white" size={27} />
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 py-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>

        <p
          className="relative text-center text-gray-500 py-2 before:content-[''] 
          before:absolute before:left-0 before:top-1/2 before:w-[45%] before:h-[1px] before:bg-gray-300 after:content-[''] 
          after:absolute after:right-0 after:top-1/2 after:w-[45%] after:h-[1px] after:bg-gray-300"
        >
          or
        </p>
        <div className="space-y-2">
          <GoogleOAuthProvider clientId="948178712281-5755ujm8o5sv36nvsqnj2uce7lc933cb.apps.googleusercontent.com">
            <GoogleSignup onError={setGoogleError} />
          </GoogleOAuthProvider>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
