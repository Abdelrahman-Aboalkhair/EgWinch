"use client";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { useValidateSessionQuery } from "./store/apis/AuthApi";
import { setCredentials } from "./store/slices/AuthSlice";
import { usePathname } from "next/navigation";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const { data } = useValidateSessionQuery();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/password-reset")) {
      return;
    }

    if (data?.user && data?.accessToken) {
      dispatch(setCredentials(data));
    }
  }, [data, dispatch, pathname]);

  if (pathname.startsWith("/password-reset")) {
    return <>{children}</>;
  }

  return <>{children}</>;
};
