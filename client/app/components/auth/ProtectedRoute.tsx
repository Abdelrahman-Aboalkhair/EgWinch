"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/sign-in",
}: ProtectedRouteProps) {
  const { isLoading, isLoggedIn } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      const currentPath = window.location.pathname;
      if (currentPath !== redirectTo) {
        localStorage.setItem("redirectAfterLogin", currentPath);
      }
      router.push(redirectTo);
    }
  }, [isLoading, isLoggedIn, router, redirectTo]);

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
