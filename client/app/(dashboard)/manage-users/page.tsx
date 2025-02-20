"use client";
import { useGetAllUsersQuery } from "@/app/libs/features/apis/UserApi";
import { useState } from "react";
import { Loader2, Trash2, Pencil, Search } from "lucide-react";
import { motion } from "framer-motion";

const ManageUsers = () => {
  const { data: users, isLoading } = useGetAllUsersQuery({});
  const [search, setSearch] = useState("");

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
              {/* Table Head */}
              <thead className="bg-gray-100">
                <tr>
                  <th className="th">ID</th>
                  <th className="th">Name</th>
                  <th className="th">Email</th>
                  <th className="th">Role</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredUsers?.length ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="td">{user._id}</td>
                      <td className="td">{user.name}</td>
                      <td className="td">{user.email}</td>
                      <td className="td">{user.role}</td>
                      <td className="td text-center flex justify-center gap-3">
                        <button className="text-blue-500 hover:text-blue-700">
                          <Pencil size={18} />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </td>
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
    </div>
  );
};

export default ManageUsers;
