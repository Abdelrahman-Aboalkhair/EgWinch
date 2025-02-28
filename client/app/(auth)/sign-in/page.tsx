"use client";
import { useForm } from "react-hook-form";
import Input from "@/app/components/atoms/Input";
import { useSignInMutation } from "../../store/apis/AuthApi";
import { setCredentials } from "../../store/slices/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RedirectHandler } from "@/app/RedirectHandler";
import GoogleSignin from "../google/GoogleSignin";

interface InputForm {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}

const SignIn = () => {
  const { isLoggedIn, accessToken } = useAppSelector((state) => state.auth);
  console.log("accessToken", accessToken);
  console.log("isLoggedIn", isLoggedIn);
  const [signIn, { error, isLoading }] = useSignInMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>();

  const onSubmit = async (formData: InputForm) => {
    console.log(formData);

    try {
      const result = await signIn(formData);
      dispatch(setCredentials(result.data));

      router.push("/");
    } catch (error: any) {
      console.error("Error occurred while signing up", error);
    }
  };

  return (
    <>
      <RedirectHandler />
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
            Sign in
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full ">
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
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <p className="text-center text-gray-500 py-4">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>

          <GoogleOAuthProvider clientId="948178712281-5755ujm8o5sv36nvsqnj2uce7lc933cb.apps.googleusercontent.com">
            <GoogleSignin />
          </GoogleOAuthProvider>
        </div>
      </main>
    </>
  );
};

export default SignIn;
