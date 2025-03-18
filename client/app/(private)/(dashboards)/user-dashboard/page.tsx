import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import React from "react";

const UserDashboard = () => {
  return (
    <ProtectedRoute requiredRoles={["user", "super-admin"]}>
      UserDashboard
    </ProtectedRoute>
  );
};

export default UserDashboard;
