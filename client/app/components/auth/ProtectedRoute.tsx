// app/components/ProtectedRoute.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRoles?: string[]; // Array of acceptable roles
  requiredPermissions?: string[]; // Array of required permissions
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/sign-in",
  requiredRoles = [], // Default to empty array (no role restriction)
  requiredPermissions = [], // Default to empty array (no permission restriction)
  fallbackPath = "/forbidden",
}: ProtectedRouteProps) {
  const { isLoading, isLoggedIn, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Check authorization logic
  const userRole = user?.role;
  const userPermissions = user?.permissions || [];
  const hasRequiredRole =
    requiredRoles.length === 0 ||
    (userRole && requiredRoles.includes(userRole));
  const hasRequiredPermissions =
    requiredPermissions.length === 0 ||
    requiredPermissions.every((perm) => userPermissions.includes(perm));

  useEffect(() => {
    if (isLoading) return; // Wait until auth state is resolved

    if (!isLoggedIn) {
      // Unauthenticated: redirect to sign-in
      const currentPath = window.location.pathname;
      if (currentPath !== redirectTo) {
        localStorage.setItem("redirectAfterLogin", currentPath);
      }
      router.push(redirectTo);
      return;
    }

    // Authenticated but unauthorized: redirect to fallback
    if (!hasRequiredRole || !hasRequiredPermissions) {
      router.push(fallbackPath);
    }
  }, [
    isLoading,
    isLoggedIn,
    userRole,
    userPermissions,
    requiredRoles,
    requiredPermissions,
    router,
    redirectTo,
    fallbackPath,
  ]);

  // Render logic
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-primary">
        <Loader2 className="animate-spin mr-2 text-[20px]" />
        <span className="text-[20px]">Loading...</span>
      </div>
    );
  }

  if (!isLoggedIn || !hasRequiredRole || !hasRequiredPermissions) {
    return null; // Redirect will handle navigation
  }

  return <>{children}</>;
}
