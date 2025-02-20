"use client";
import { useState } from "react";
import {
  useCreateAdminMutation,
  useGetAllUsersQuery,
} from "@/app/libs/features/apis/UserApi";
import { Loader2, Search, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

const ManageUsers = () => {
  const [createAdmin, { isLoading: createAdminLoading }] =
    useCreateAdminMutation();
  const { data: users, isLoading } = useGetAllUsersQuery({});
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleCreateAdmin = async () => {
    await createAdmin(adminData);
    setIsModalOpen(false);
  };

  const filteredUsers = users?.users?.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Users</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-3 py-2 border rounded-md w-64 focus:ring focus:ring-primary focus:outline-none focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Show Create Admin button only for admins */}
        {users?.currentUser?.role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle size={18} /> Create Admin
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="th">ID</th>
                  <th className="th">Name</th>
                  <th className="th">Email</th>
                  <th className="th">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.length ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id || user._id} className="hover:bg-gray-50">
                      <td className="td">{user._id}</td>
                      <td className="td">{user.name}</td>
                      <td className="td">{user.email}</td>
                      <td className="td">{user.role}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Create Admin Modal */}
      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="input"
              value={adminData.name}
              onChange={(e) =>
                setAdminData({ ...adminData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="input"
              value={adminData.email}
              onChange={(e) =>
                setAdminData({ ...adminData, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="input"
              value={adminData.phoneNumber}
              onChange={(e) =>
                setAdminData({ ...adminData, phoneNumber: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={adminData.password}
              onChange={(e) =>
                setAdminData({ ...adminData, password: e.target.value })
              }
            />
            <button onClick={handleCreateAdmin} disabled={createAdminLoading}>
              {createAdminLoading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
