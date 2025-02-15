import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axiosInstance from "@/app/helpers/axiosInstance";
import { useAppDispatch } from "@/app/libs/hooks";
import { setCredentials } from "@/app/libs/features/slices/AuthSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GoogleIcon from "@/app/assets/auth/google.png";

const CustomGoogleAuthButton = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const login = useGoogleLogin({
    useOneTap: true,
    onSuccess: async (tokenResponse: any) => {
      console.log("tokenResponse: ", tokenResponse);
      try {
        const res = await axiosInstance.post("/auth/google", {
          access_token: tokenResponse?.access_token,
        });
        console.log("User authenticated:", res.data);

        dispatch(setCredentials(res));

        router.push("/");
      } catch (error) {
        console.error("Google auth failed", error);
      }
    },
    onError: (error) => {
      console.error("Google login failed", error);
    },
    flow: "implicit",
  });

  return (
    <>
      <div className="flex items-center my-2">
        <div className="flex-grow border-t border-gray-300"></div>
        <p className="px-4 text-center">or</p>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <button
        onClick={() => login()}
        className="flex items-center justify-center gap-2 border-[2.5px] bg-gray-50 border-gray-100 text-black py-4 font-medium rounded-md w-full
      "
      >
        <Image
          src={GoogleIcon}
          width={26}
          height={26}
          alt="Google"
          className="ml-2"
        />
        Continue with Google
      </button>
    </>
  );
};

export default CustomGoogleAuthButton;
