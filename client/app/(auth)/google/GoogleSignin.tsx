import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axiosInstance from "@/app/helpers/axiosInstance";
import { useAppDispatch } from "@/app/libs/hooks";
import { setCredentials } from "@/app/libs/features/slices/AuthSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GoogleIcon from "@/app/assets/auth/google.png";

const GoogleSignin = () => {
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
