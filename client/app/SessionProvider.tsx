"use client";
import { useEffect } from "react";
import { useAppDispatch } from "./libs/hooks";
import { useValidateSessionQuery } from "./libs/features/apis/AuthApi";
import { setCredentials } from "./libs/features/slices/AuthSlice";
import TruckLoader from "./components/custom/TruckLoader";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useValidateSessionQuery();

  useEffect(() => {
    if (data?.user && data?.accessToken) {
      dispatch(setCredentials(data));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center gap-3">
        <TruckLoader />
      </main>
    );
  }

  return <>{children}</>;
};
