import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axiosInstance from "@/app/utils/axiosInstance";
import { useAppDispatch } from "@/app/store/hooks";
import { setCredentials } from "../../store/slices/AuthSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GoogleIcon from "@/app/assets/icons/google.png";

const GoogleSignin = ({ onError }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const signin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axiosInstance.post("/auth/google-signin", {
          access_token: tokenResponse.access_token,
        });

        dispatch(setCredentials(res.data));
        router.push("/");
      } catch (error) {
        onError(
          error?.response?.data?.message ?? "An error occurred while signing in"
        );
        console.error("Google sign-in failed", error);
      }
    },
    onError: (error) => {
      console.error("Google sign-in failed", error);
    },
  });

  return (
    <button
      onClick={() => signin()}
      className="flex items-center justify-center gap-2 border-[2.5px] bg-gray-50 border-gray-100 text-black py-4 font-medium rounded-md w-full"
    >
      <Image
        src={GoogleIcon}
        width={26}
        height={26}
        alt="Google"
        className="ml-2"
      />
      Sign in with Google
    </button>
  );
};

export default GoogleSignin;
