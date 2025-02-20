"use client";
import { useEffect } from "react";
import { useAppDispatch } from "./libs/hooks";
import { useValidateSessionQuery } from "./libs/features/apis/AuthApi";
import { setCredentials } from "./libs/features/slices/AuthSlice";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useValidateSessionQuery();
  console.log("data: ", data);

  useEffect(() => {
    if (data?.user && data?.accessToken) {
      dispatch(setCredentials(data));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
