"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/app/store/hooks";
import { useValidateSessionQuery } from "@/app/store/apis/AuthApi";
import { setCredentials } from "@/app/store/slices/AuthSlice";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const { data } = useValidateSessionQuery();
  const pathname = usePathname();

  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/password-reset",
    "/verify-email",
  ];

  const isPasswordResetRoute = pathname.startsWith("/password-reset");

  useEffect(() => {
    if (publicRoutes.includes(pathname) || isPasswordResetRoute) return;

    if (data?.user && data?.accessToken) {
      dispatch(setCredentials(data));
    }
  }, [data, dispatch, pathname]);

  return <>{children}</>;
};
