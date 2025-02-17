"use client";
import Image from "next/image";
import { useGetAllDriversQuery } from "../libs/features/apis/UserApi";
import Link from "next/link";
import User from "../assets/user.png";

interface Driver {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  capacity: number;
  driverLicenseNumber: string;
  driverLicenseExpiry: Date;
  registrationNumber: string;
  registrationExpiry: Date;
  availabilityStatus: string;
  profilePicture: {
    secure_url: string;
  };
}

const Drivers = () => {
  const { data, isLoading, error } = useGetAllDriversQuery({});

  if (isLoading)
    return (
      <p className="text-center text-primary text-xl">Loading drivers...</p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 text-xl">
        Error loading drivers: {error.message}
      </p>
    );

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold text-primary text-center mb-6">
        Drivers Profile Page
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.users?.map((driver: Driver) => (
          <div
            key={driver._id}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center"
          >
            <Image
              src={driver.profilePicture?.secure_url || User}
              alt={driver.name}
              width={100}
              height={100}
              className="object-cover rounded-full mb-4"
            />
            <h2 className="text-2xl font-semibold text-primary mb-2">
              {driver.name}
            </h2>
            <p className="text-gray-700 mb-1">📧 {driver.email}</p>
            <p className="text-gray-700 mb-1">📞 {driver.phoneNumber}</p>
            <p className="text-gray-700 mb-1">🚚 Capacity: {driver.capacity}</p>
            <p className="text-gray-700 mb-1">
              🪪 License Number: {driver.driverLicenseNumber}
            </p>
            <p className="text-gray-700 mb-1">
              📆 License Expiry:{" "}
              {new Date(driver.driverLicenseExpiry).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-1">
              🔖 Registration Number: {driver.registrationNumber}
            </p>
            <p className="text-gray-700 mb-1">
              📆 Registration Expiry:{" "}
              {new Date(driver.registrationExpiry).toLocaleDateString()}
            </p>
            <p
              className={`mt-3 text-lg font-medium ${
                driver.availabilityStatus === "available"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {driver.availabilityStatus === "available"
                ? "Available"
                : "Unavailable"}
            </p>

            <Link href={`/chat/${driver._id}`} className="my-4">
              <span className="bg-primary text-white px-[12px] py-[8px] rounded-lg active:scale-95">
                Chat
              </span>{" "}
              with {driver.name}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Drivers;
