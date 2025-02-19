"use client";
import { useForm } from "react-hook-form";
import Input from "@/app/components/custom/Input";
import { useSignUpMutation } from "@/app/libs/features/apis/AuthApi";
import { setCredentials } from "@/app/libs/features/slices/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleAuthButton from "../google/GoogleAuthButton";

interface InputForm {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}

const UserSignUp = () => {
  const { isLoggedIn, accessToken } = useAppSelector((state) => state.auth);
  const [signUp, { error, isLoading }] = useSignUpMutation();
  console.log("error: ", error);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<InputForm>();

  const onSubmit = async (formData: InputForm) => {
    console.log(formData);

    try {
      const result = await signUp(formData);
      dispatch(setCredentials(result));

      // Redirect to verify email page
      if (result.data?.success) {
        router.push("/auth/verify-email");
      }
    } catch (error: any) {
      console.error("Error occurred while signing up", error);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Sign up
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-center text-red-700 px-4 py-[18px] rounded relative mb-4">
            <span className="block sm:inline">
              {" "}
              {error?.message || "An unexpected error occurred."}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full ">
          <div>
            <Input
              name="name"
              type="name"
              placeholder="Name"
              register={register}
              validation={{
                required: "Name is required",
              }}
              error={errors.name?.message}
              className="py-[18px]"
            />
          </div>
          <div>
            <Input
              name="phoneNumber"
              type="phoneNumber"
              placeholder="Phone Number"
              register={register}
              validation={{
                required: "Phone Number is required",
              }}
              error={errors.phoneNumber?.message}
              className="py-[18px]"
            />
          </div>
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              register={register}
              validation={{
                required: "Email is required",
              }}
              error={errors.email?.message}
              className="py-[18px]"
            />
          </div>

          <div>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              register={register}
              validation={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              }}
              error={errors.password?.message}
              className="py-[18px]"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-[14px] bg-primary text-white rounded-sm font-medium hover:opacity-90"
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 py-4">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>

        <GoogleOAuthProvider clientId="948178712281-5755ujm8o5sv36nvsqnj2uce7lc933cb.apps.googleusercontent.com">
          <GoogleAuthButton />
        </GoogleOAuthProvider>
      </div>
    </main>
  );
};

export default UserSignUp;
