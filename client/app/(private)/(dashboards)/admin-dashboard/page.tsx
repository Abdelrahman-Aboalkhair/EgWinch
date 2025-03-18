"use client";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import { useGetUserBookingsQuery } from "@/app/store/apis/BookingApi";
import { useAppSelector } from "@/app/store/hooks";
import { motion } from "framer-motion";
import {
  BarChart3,
  Loader2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import StatsCard from "../StatsCard";

const AdminDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useGetUserBookingsQuery({});

  const userRole = user?.role;

  const totalBookings = data?.totalBookings || 0;
  const totalOffers = data?.totalOffers || 0;
  const completedBookings = data?.completedBookings || 5;
  const canceledBookings = data?.canceledBookings || 2;
  const pendingBookings = data?.pendingBookings || 3;
  const totalEarnings =
    userRole === "driver" ? data?.totalEarnings || 1200 : null;

  return (
    <ProtectedRoute requiredRoles={["admin", "super-admin"]}>
      <motion.div
        className="p-6 bg-gray-50 min-h-[30vh] flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl font-semibold text-gray-800 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          AdminDashboard Overview
        </motion.h1>

        {isLoading ? (
          <motion.div
            className="flex items-center gap-2 text-gray-600 text-lg"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Loader2 className="h-8 w-8 animate-spin" />
            Loading...
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[90%]"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            <StatsCard
              title="Completed Bookings"
              value={completedBookings}
              icon={<CheckCircle size={28} />}
              bgColor="bg-green-600"
            />

            <StatsCard
              title="Canceled Bookings"
              value={canceledBookings}
              icon={<XCircle size={28} />}
              bgColor="bg-red-600"
            />

            <StatsCard
              title="Pending Bookings"
              value={pendingBookings}
              icon={<Clock size={28} />}
              bgColor="bg-yellow-600"
            />

            <StatsCard
              title={
                userRole === "driver"
                  ? "Total Offers Made"
                  : "Total Offers Received"
              }
              value={totalOffers}
              icon={<FileText size={28} />}
              bgColor="bg-primary"
            />

            {userRole === "driver" && (
              <StatsCard
                title="Total Bookings"
                value={totalBookings}
                icon={<BarChart3 size={28} />}
                bgColor="bg-blue-700"
              />
            )}

            {userRole === "driver" && (
              <StatsCard
                title="Total Earnings"
                value={`$${totalEarnings}`}
                icon={<DollarSign size={28} />}
                bgColor="bg-gray-800"
              />
            )}
          </motion.div>
        )}
      </motion.div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
