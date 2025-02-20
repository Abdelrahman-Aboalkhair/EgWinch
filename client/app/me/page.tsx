"use client";
import { useGetProfileQuery } from "../libs/features/apis/UserApi";

const ProfilePage = () => {
  const { data, isLoading, error } = useGetProfileQuery({});

  if (isLoading) return <div className="text-center text-lg">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500">Error fetching profile</div>
    );

  const { user } = data;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-96 flex flex-col items-center">
        <img
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
      </div>
    </div>
  );
};

export default ProfilePage;
