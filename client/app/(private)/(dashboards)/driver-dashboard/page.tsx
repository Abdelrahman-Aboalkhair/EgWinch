import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import React from "react";

const DriverDashboard = () => {
  return (
    <ProtectedRoute requiredRoles={["driver", "super-admin"]}>
      DriverDashboard
    </ProtectedRoute>
  );
};

export default DriverDashboard;
