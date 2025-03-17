"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";
import { routeConfig } from "./config/routeConfig";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isLoggedIn } = useAppSelector((state) => state.auth);
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
      if (isLoggedIn && isAuthOnlyRoute) {
        router.push("/");
        return;
      }

      if (!isLoggedIn && isProtectedRoute) {
        router.push("/sign-in");
        return;
      }
    }
  }, [
    isLoading,
    isLoggedIn,
    pathname,
    router,
    isProtectedRoute,
    isAuthOnlyRoute,
  ]);

  return <>{children}</>;
}
