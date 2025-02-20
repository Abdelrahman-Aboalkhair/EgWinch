"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const RedirectHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    }
  }, [router]);

  return null;
};
