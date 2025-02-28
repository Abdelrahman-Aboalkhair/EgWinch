"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "./store/hooks";

export const RedirectHandler = () => {
  const router = useRouter();
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      }
    }
  }, [isLoggedIn, router]);

  return null;
};
