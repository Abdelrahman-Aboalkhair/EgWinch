import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import React from "react";

const History = () => {
  return (
    <ProtectedRoute requiredRoles={["user", "super-admin"]}>
      History
    </ProtectedRoute>
  );
};

export default History;
