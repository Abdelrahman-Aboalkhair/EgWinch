"use client";
import { useForm } from "react-hook-form";
import Input from "@/app/components/custom/Input";
import { setCredentials } from "@/app/libs/features/slices/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DatePicker from "@/app/components/custom/DatePicker";
import { useRegisterDriverMutation } from "@/app/libs/features/apis/AuthApi";
import Dropdown from "@/app/components/custom/Dropdown";

interface InputForm {
  name: string;
  phoneNumber: string;
  email: string;
  profilePicture: string;
  address: string;
  licenseNumber: string;
  licenseImage: string;
  licenseExpiry: string;
  experienceYears: number;
  vehicleType: string;
  password: string;
}

const DriverSignUp = () => {
  const [registerDriver, { error, isLoading }] = useRegisterDriverMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<InputForm>();

  const onSubmit = async (data: InputForm) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("licenseNumber", data.licenseNumber);
    formData.append("licenseImage", data.licenseImage);
    formData.append("licenseExpiry", data.licenseExpiry);
    formData.append("experienceYears", data.experienceYears.toString());
    formData.append("vehicleType", data.vehicleType);
    formData.append("password", data.password);

    if (data.profilePicture) {
      formData.append("profilePicture", data.profilePicture);
    }

    console.log("FormData entries: ");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const result = await registerDriver(formData);
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
              name="address"
              type="text"
              placeholder="Address"
              register={register}
              validation={{ required: "Address is required" }}
              error={errors.address?.message}
              className="py-[18px]"
            />

            <Input
              name="experienceYears"
              type="number"
              placeholder="Experience Years"
              register={register}
              validation={{ required: "Experience Years is required" }}
              error={errors.experienceYears?.message}
              className="py-[18px]"
            />

            <Dropdown
              options={["small truck", "medium truck", "large truck", "winch"]}
              label="Vehicle Type"
              onSelect={(value) => setValue("vehicleType", value)}
              onClear={() => setValue("vehicleType", "")}
            />

            <Input
              name="licenseNumber"
              type="text"
              placeholder="License Number"
              register={register}
              validation={{ required: "License Number is required" }}
              error={errors.licenseNumber?.message}
              className="py-[15px]"
            />
            <Input
              name="licenseImage"
              type="file"
              placeholder="License Image"
              setValue={setValue}
              register={register}
              validation={{ required: "License Image is required" }}
              error={errors.licenseImage?.message}
              className="py-[15px]"
            />
            <DatePicker
              name="licenseExpiry"
              control={control}
              label="License Expiry Date"
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
