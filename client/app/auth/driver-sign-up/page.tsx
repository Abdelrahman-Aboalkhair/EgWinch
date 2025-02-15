"use client";
import { useForm } from "react-hook-form";
import Input from "@/app/components/custom/Input";
import { useSignUpMutation } from "@/app/libs/features/apis/AuthApi";
import { setCredentials } from "@/app/libs/features/slices/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DatePicker from "@/app/components/custom/DatePicker";

interface InputForm {
  name: string;
  phoneNumber: string;
  email: string;
  driverLicenseNumber: string;
  driverLicenseImage: string;
  driverLicenseExpiry: string;
  registrationNumber: string;
  registrationImage: string;
  registrationExpiryDate: string;
  capacity: string;
  password: string;
}

const DriverSignUp = () => {
  const { isLoggedIn, accessToken } = useAppSelector((state) => state.auth);
  const [signUp, { error, isLoading }] = useSignUpMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<InputForm>();

  const onSubmit = async (formData: InputForm) => {
    console.log("formData", formData);
    try {
      const result = await signUp(formData);
      dispatch(setCredentials(result));

      if (result.data?.success) {
        router.push("/auth/verify-email");
      }
    } catch (error: any) {
      console.error("Error occurred while signing up", error);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-[50%] p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Join as a Driver
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-center text-red-700 px-4 py-[15px] rounded relative mb-4">
            <span className="block sm:inline">
              {error?.message || "An unexpected error occurred."}
            </span>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-full flex-col flex items-center justify-center"
        >
          <div className="grid grid-cols-2 gap-2 ">
            <Input
              name="name"
              type="text"
              placeholder="Name"
              register={register}
              validation={{ required: "Name is required" }}
              error={errors.name?.message}
              className="py-[15px]"
            />
            <Input
              name="phoneNumber"
              type="text"
              placeholder="Phone Number"
              register={register}
              validation={{ required: "Phone Number is required" }}
              error={errors.phoneNumber?.message}
              className="py-[15px]"
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              register={register}
              validation={{ required: "Email is required" }}
              error={errors.email?.message}
              className="py-[15px]"
            />
            <Input
              name="driverLicenseNumber"
              type="text"
              placeholder="License Number"
              register={register}
              validation={{ required: "License Number is required" }}
              error={errors.driverLicenseNumber?.message}
              className="py-[15px]"
            />
            <Input
              name="driverLicenseImage"
              type="file"
              placeholder="License Image"
              register={register}
              // validation={{ required: "License Image is required" }}
              error={errors.driverLicenseImage?.message}
              className="py-[15px]"
            />
            <DatePicker
              name="driverLicenseExpiry"
              control={control}
              label="License Expiry Date"
            />
            <Input
              name="registrationNumber"
              type="text"
              placeholder="Registration Number"
              register={register}
              validation={{ required: "Registration Number is required" }}
              error={errors.registrationNumber?.message}
              className="py-[15px]"
            />
            <DatePicker
              name="registrationExpiryDate"
              control={control}
              label="Registration Expiry Date"
            />
            <Input
              name="registrationImage"
              type="file"
              placeholder="Registration Image"
              register={register}
              // validation={{ required: "Registration Image is required" }}
              error={errors.registrationImage?.message}
              className="py-[15px]"
            />
            <Input
              name="capacity"
              type="number"
              placeholder="Capacity (in KG)"
              register={register}
              validation={{ required: "Capacity is required" }}
              error={errors.capacity?.message}
              className="py-[15px]"
            />
            <Input
              name="proilePicture"
              type="file"
              placeholder="Profile Picture"
              register={register}
              // validation={{ required: "Profile Picture is required" }}
              error={errors.registrationImage?.message}
              className="py-[15px]"
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
              className="py-[15px]"
            />
          </div>

          <button
            type="submit"
            className="w-1/2 py-[14px] bg-primary text-white rounded-sm font-medium hover:opacity-90"
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default DriverSignUp;
