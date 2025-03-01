import React from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axiosInstance from "@/app/utils/axiosInstance";
import { useAppDispatch } from "@/app/store/hooks";
import { setCredentials } from "@/app/store/slices/AuthSlice";
import { useRouter } from "next/navigation";
import { FaFacebook } from "react-icons/fa";

const FacebookSignup = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const responseFacebook = async (response) => {
    console.log("response: ", response);
    try {
      const res = await axiosInstance.post("/auth/facebook-signup", {
        access_token: response.accessToken,
      });

      dispatch(setCredentials(res.data));
      router.push("/");
    } catch (error) {
      console.error("Facebook sign-up failed", error);
    }
  };

  return (
    <FacebookLogin
      appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
      onSuccess={responseFacebook}
      render={({ onClick }) => (
        <button
          onClick={onClick}
          className="flex items-center justify-center gap-2 border-[2.5px] bg-gray-50 border-gray-100 text-black py-4 font-medium rounded-md w-full"
        >
          <FaFacebook color="#3b5998" size={30} />
          Sign up with Facebook
        </button>
      )}
    />
  );
};

export default FacebookSignup;
