import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import React from "react";

const Analytics = () => {
  return (
    <ProtectedRoute requiredRoles={["super-admin", "admin"]}>
      Analytics
    </ProtectedRoute>
  );
};

export default Analytics;
