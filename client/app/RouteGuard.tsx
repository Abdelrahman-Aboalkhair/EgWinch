"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";
import { routeConfig } from "./config/routeConfig";
import TruckLoader from "./components/atoms/TruckLoader";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, accessToken } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  const isProtectedRoute = routeConfig.protected.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthOnlyRoute = routeConfig.authOnly.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    if (!isLoading) {
      if (!accessToken && isProtectedRoute) {
        router.push("/sign-in");
        return;
      }
    }
  }, [
    isLoading,
    accessToken,
    pathname,
    router,
    isProtectedRoute,
    isAuthOnlyRoute,
  ]);

  if (isLoading && (isProtectedRoute || isAuthOnlyRoute)) {
    return <TruckLoader />;
  }

  return <>{children}</>;
}
