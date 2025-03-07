"use client";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { useValidateSessionQuery } from "./store/apis/AuthApi";
import { setCredentials } from "./store/slices/AuthSlice";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const { data } = useValidateSessionQuery();

  useEffect(() => {
    if (data?.user && data?.accessToken) {
      dispatch(setCredentials(data));
    }
  }, [data, dispatch]);

  return <>{children}</>;
};
