"use client";
import { useForm } from "react-hook-form";
import Input from "@/app/components/custom/Input";
import { useRegisterCustomerMutation } from "@/app/libs/features/apis/AuthApi";
import { setCredentials } from "@/app/libs/features/slices/AuthSlice";
import { useAppDispatch } from "@/app/libs/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import GoogleSignup from "../google/GoogleSignup";

interface InputForm {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  password: string;
  profilePicture: string;
}

const RegisterCustomer = () => {
  const [registerCustomer, { error, isLoading }] =
    useRegisterCustomerMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<InputForm>();

  const onSubmit = async (data: InputForm) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("password", data.password);

    if (data.profilePicture) {
      formData.append("profilePicture", data.profilePicture);
    }

    try {
      const result = await registerCustomer(formData);
      console.log("result: ", result);
      dispatch(setCredentials(result));

      if (result.data?.success) {
        router.push("/verify-email");
      }
    } catch (error) {
      console.error("Error occurred while signing up", error);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Sign up
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-center text-red-700 px-4 py-[18px] rounded relative mb-4">
            <span className="block sm:inline">
              {error?.message || "An unexpected error occurred."}
            </span>
          </div>
        )}

        {/* Form Grid Layout */}
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Input
            name="name"
            type="text"
            placeholder="Name"
            register={register}
            validation={{ required: "Name is required" }}
            error={errors.name?.message}
            className="py-[18px]"
          />
          <Input
            name="phoneNumber"
            type="text"
            placeholder="Phone Number"
            register={register}
            validation={{ required: "Phone Number is required" }}
            error={errors.phoneNumber?.message}
            className="py-[18px]"
          />
          <Input
            name="email"
            type="text"
            placeholder="Email"
            register={register}
            validation={{ required: "Email is required" }}
            error={errors.email?.message}
            className="py-[18px]"
          />
          <Input
            name="address"
            type="text"
            placeholder="Address"
            register={register}
            validation={{ required: "Address is required" }}
            error={errors.address?.message}
            className="py-[18px]"
          />
          <Input
            name="profilePicture"
            type="file"
            placeholder="Profile picture"
            register={register}
            setValue={setValue}
            validation={{
              required: "Profile picture is required",
            }}
            error={errors.profilePicture?.message}
            className="py-[18px]"
          />

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

          {/* Submit button in full width */}
          <div className="col-span-1 sm:col-span-2">
            <button
              type="submit"
              className="flex items-center justify-center w-[60%] block mx-auto py-[14px] bg-primary text-white rounded font-medium hover:opacity-90"
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-white" size={27} />
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </form>

        {/* Sign in & Google Auth */}
        <p className="text-center text-gray-500 py-4">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>

        <div className="w-[60%] mx-auto">
          <GoogleOAuthProvider clientId="948178712281-5755ujm8o5sv36nvsqnj2uce7lc933cb.apps.googleusercontent.com">
            <GoogleSignup />
          </GoogleOAuthProvider>
        </div>
      </div>
    </main>
  );
};

export default RegisterCustomer;
