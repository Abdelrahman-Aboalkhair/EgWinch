"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useRestoreSessionQuery } from "@/app/store/apis/AuthApi";
import { clearAuthState, setAuthLoading } from "@/app/store/slices/AuthSlice";
import { Loader2 } from "lucide-react";

const Toast = dynamic(() => import("../molecules/Toast"));

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { isLoggedIn, isLoading } = useAppSelector((state) => state.auth);
  const skipRoutes = [
    "/sign-in",
    "/sign-up",
    "/password-reset",
    "/verify-email",
  ];

  const { isFetching, error } = useRestoreSessionQuery(undefined, {
    skip: typeof window === "undefined" || skipRoutes.includes(pathname),
  });

  useEffect(() => {
    dispatch(setAuthLoading(isFetching));
    if (error && "status" in error && error.status === 401) {
      dispatch(clearAuthState());
      if (!skipRoutes.includes(pathname) && !isLoggedIn && !isLoading) {
        window.location.href = "/sign-in";
      }
    }
    if (isLoggedIn && skipRoutes.includes(pathname)) {
      window.location.href = "/dashboard";
    }
  }, [isFetching, error, isLoggedIn, isLoading, dispatch, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-primary">
        <Loader2 className="animate-spin mr-2 text-[20px] " />
        <span className="text-[20px]">Loading...</span>
      </div>
    );
  }

  return (
    <>
      {children}
      <Toast />
    </>
  );
}
