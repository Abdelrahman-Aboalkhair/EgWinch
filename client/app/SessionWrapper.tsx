// app/SessionWrapper.tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useRestoreSessionQuery } from "./store/apis/AuthApi";
import { setAuthLoading, clearAuthState } from "./store/slices/AuthSlice";
import { Loader2 } from "lucide-react";

const Toast = dynamic(() => import("./components/molecules/Toast"));

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
      if (!skipRoutes.includes(pathname)) {
        window.location.href = "/sign-in";
      }
    }
    if (isLoggedIn && skipRoutes.includes(pathname)) {
      window.location.href = "/dashboard";
    }
  }, [isFetching, error, isLoggedIn, dispatch, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-primary">
        <Loader2 className="animate-spin mr-2 text-[20px]" />
        <span className="text-[20px] font-medium">Loading...</span>
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
