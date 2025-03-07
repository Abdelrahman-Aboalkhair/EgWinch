"use client";
import TruckLoader from "./components/atoms/TruckLoader";

const GlobalLoading = () => {
  return (
    <main className="min-h-screen flex items-center justify-center gap-3">
      <TruckLoader />
    </main>
  );
};

export default GlobalLoading;
