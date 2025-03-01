"use client";
import { useForm } from "react-hook-form";
import Input from "@/app/components/atoms/Input";
import { useRegisterCustomerMutation } from "@/app/store/apis/AuthApi";
import { setCredentials } from "@/app/store/slices/AuthSlice";
import { useAppDispatch } from "@/app/store/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import GoogleSignup from "../(oAuth)/google/GoogleSignup";
import useToast from "@/app/hooks/useToast";
import FacebookSignup from "../(oAuth)/facebook/FacebookSignup";

interface InputForm {
  name: string;
  email: string;
  password: string;
}

const RegisterCustomer = () => {
  const { showToast } = useToast();
  const [registerCustomer, { error, isLoading }] =
    useRegisterCustomerMutation();
  console.log("error: ", error);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>();

  const onSubmit = async (data: InputForm) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const result = await registerCustomer(formData);
      console.log("result: ", result);
      dispatch(setCredentials(result));

      if (result.data?.success) {
        showToast(result.data?.message, "success");
        router.push("/verify-email");
      }
    } catch (error) {
      console.error("Error occurred while signing up", error);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-3xl p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Sign up
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-center text-red-700 w-[60%] mx-auto px-4 py-[18px] rounded relative mb-4">
            <span className="block sm:inline">
              {error?.data?.message || "An unexpected error occurred."}
            </span>
          </div>
        )}

        {/* Form Grid Layout */}
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center gap-3 w-[60%] mx-auto"
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
            name="email"
            type="text"
            placeholder="Email"
            register={register}
            validation={{ required: "Email is required" }}
            error={errors.email?.message}
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

        {/* Sign in & Google Auth */}
        <p className="text-center text-gray-500 py-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>

        <div className="w-[60%] mx-auto">
          <GoogleOAuthProvider clientId="948178712281-5755ujm8o5sv36nvsqnj2uce7lc933cb.apps.googleusercontent.com">
            <GoogleSignup />
          </GoogleOAuthProvider>

          <FacebookSignup />
        </div>
      </div>
    </main>
  );
};

export default RegisterCustomer;
