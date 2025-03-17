"use client";
import { useForm } from "react-hook-form";
import Input from "@/app/components/atoms/Input";
import { useSignInMutation } from "../../store/apis/AuthApi";
import { setCredentials } from "../../store/slices/AuthSlice";
import { useAppDispatch } from "@/app/store/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleSignin from "../(oAuth)/google/GoogleSignin";
import { useState } from "react";
import FacebookSignin from "../(oAuth)/facebook/FacebookSignin";
import AuthLayout from "@/app/components/templates/AuthLayout";

interface InputForm {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}

const SignIn = () => {
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [facebookError, setFacebookError] = useState<string | null>(null);
  const [signIn, { error, isLoading }] = useSignInMutation();
  console.log("error: ", error);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: InputForm) => {
    try {
      const result = await signIn(formData).unwrap();
      console.log("result: ", result);
      dispatch(
        setCredentials({
          accessToken: result.accessToken,
          user: result.user,
        })
      );
      if (result.success && result.user.role === ("super-admin" || "admin")) {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-6">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Sign in
        </h2>

        {(error || googleError) && (
          <div className="bg-red-100 border border-red-400 text-center text-red-700 w-full mx-auto px-4 py-[18px] rounded relative mb-4">
            <span className="block sm:inline">
              {error?.data?.message ||
                googleError ||
                "An unexpected error occurred"}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full ">
          <Input
            name="email"
            type="text"
            placeholder="Email"
            control={control}
            validation={{ required: "Email is required" }}
            error={errors.email?.message}
            className="py-[18px]"
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            control={control}
            validation={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            }}
            error={errors.password?.message}
            className="py-[18px] mb-2"
          />

          <Link
            href="/password-reset"
            className="text-[15px] text-gray-800 hover:underline
            "
          >
            Forgot password?
          </Link>

          <button
            type="submit"
            className="w-full py-[14px] bg-primary text-white rounded-sm font-medium hover:opacity-90"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-gray-500 pt-4">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary font-medium hover:underline"
          >
            Sign up
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
            <GoogleSignin onError={setGoogleError} />
          </GoogleOAuthProvider>

          <FacebookSignin onError={setFacebookError} />
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
