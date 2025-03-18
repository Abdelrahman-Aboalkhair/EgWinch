"use client";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import { useGetMeQuery } from "@/app/store/apis/UserApi";
import { CalendarDaysIcon, CalendarRange, Truck } from "lucide-react";
import Image from "next/image";
const Me = () => {
  const { data, isLoading, error } = useGetMeQuery({});

  if (isLoading) return <div className="text-center text-lg">Loading...</div>;
  if (error || !data?.user)
    return (
      <div className="text-center text-red-500">Error fetching profile</div>
    );

  const { user } = data;
  const isDriver = user.role === "driver";

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-96 flex flex-col items-center">
          <Image
            width={200}
            height={200}
            src={user.profilePicture?.secure_url}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-gray-300"
          />
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {user.name}
          </h2>
          <p className="text-gray-600 text-lg">{user.email}</p>
          <span className="mt-2 px-4 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium capitalize">
            {user.role}
          </span>

          {isDriver && (
            <div className="mt-6 w-full">
              <h3 className="text-lg font-semibold text-gray-700">
                Driver Information
              </h3>
              <div className="mt-2 space-y-2">
                <p className="flex items-center text-gray-600">
                  <Truck className="mr-2 text-yellow-500" /> Completed Moves:{" "}
                  {user.completedMoves || 0}
                </p>
                <p className="text-gray-600">
                  Rating: ⭐ {user.rating || "N/A"} / 5
                </p>
                <p className="flex items-center text-gray-600">
                  <CalendarDaysIcon className="mr-2 text-purple-500" /> License
                  Number: {user.driverLicenseNumber || "N/A"}
                </p>
                <p className="flex items-center text-gray-600">
                  <CalendarRange className="mr-2 text-gray-500" /> License
                  Expiry:{" "}
                  {user.driverLicenseExpiry
                    ? new Date(user.driverLicenseExpiry).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="flex items-center text-gray-600">
                  <CalendarRange className="mr-2 text-blue-400" /> Registration
                  Number: {user.registrationNumber || "N/A"}
                </p>
                <p className="flex items-center text-gray-600">
                  <CalendarRange className="mr-2 text-gray-500" /> Registration
                  Expiry:{" "}
                  {user.registrationExpiry
                    ? new Date(user.registrationExpiry).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="flex items-center text-gray-600">
                  <Truck className="mr-2 text-orange-500" /> Vehicle Capacity:{" "}
                  {user.capacity || "N/A"}
                </p>
                <p className="text-gray-600">
                  <strong>Availability:</strong>{" "}
                  {user.availabilityStatus || "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Me;
