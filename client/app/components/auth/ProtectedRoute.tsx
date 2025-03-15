"use client";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/app/hooks/state/useRedux";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();

  const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/password-reset",
    "/verify-email",
  ];
  const isPasswordResetRoute = pathname.startsWith("/password-reset");

  useEffect(() => {
    if (!user && !publicRoutes.includes(pathname) && !isPasswordResetRoute) {
      router.push("/sign-in");
      return;
    }

    if (user && roles && !roles.includes(user.role)) {
      router.push("/unauthorized");
    }
  }, [user, pathname, router, roles]);

  if (!user && !publicRoutes.includes(pathname) && !isPasswordResetRoute) {
    return null;
  }

  if (user && roles && !roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
