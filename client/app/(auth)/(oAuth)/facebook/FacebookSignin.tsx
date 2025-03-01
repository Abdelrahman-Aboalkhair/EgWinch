import React from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axiosInstance from "@/app/utils/axiosInstance";
import { useAppDispatch } from "@/app/store/hooks";
import { setCredentials } from "../../../store/slices/AuthSlice";
import { useRouter } from "next/navigation";
import { FaFacebook } from "react-icons/fa";

const FacebookSignin = ({ onError }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const responseFacebook = async (response) => {
    if (!response.accessToken) {
      onError("Facebook sign-in failed");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/facebook-signin", {
        access_token: response.accessToken,
      });

      dispatch(setCredentials(res.data));
      router.push("/");
    } catch (error) {
      onError(
        error?.response?.data?.message ?? "An error occurred while signing in"
      );
      console.error("Facebook sign-in failed", error);
    }
  };

  return (
    <FacebookLogin
      appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
      onSuccess={responseFacebook}
      scope="abdelrahman.aboalkhair1@gmail.com"
      render={({ onClick }) => (
        <button
          onClick={onClick}
          className="flex items-center justify-center gap-2 border-[2.5px] bg-gray-50 border-gray-100 text-black py-4 font-medium rounded-md w-full"
        >
          <FaFacebook color="#3b5998" size={30} />
          Sign in with Facebook
        </button>
      )}
    />
  );
};

export default FacebookSignin;
