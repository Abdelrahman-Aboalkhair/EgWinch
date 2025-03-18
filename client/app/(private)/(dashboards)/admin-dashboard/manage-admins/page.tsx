import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import React from "react";

const ManageAdmins = () => {
  return (
    <ProtectedRoute requiredRoles={["super-admin"]}>
      ManageAdmins
    </ProtectedRoute>
  );
};

export default ManageAdmins;
