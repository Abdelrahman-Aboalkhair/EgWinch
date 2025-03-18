import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import React from "react";

const Offers = () => {
  return (
    <ProtectedRoute requiredRoles={["driver", "super-admin"]}>
      Offers
    </ProtectedRoute>
  );
};

export default Offers;
