"use client";

import { useGetBookingsQuery } from "@/app/libs/features/apis/BookingApi";
import { motion } from "framer-motion";
import { BarChart3, Loader2, FileText } from "lucide-react";

const Dashboard = () => {
  const { data, isLoading } = useGetBookingsQuery({});
  console.log("data: ", data);
  const bookingLength = data?.totalBookings || 0;
  const offersLength = data?.totalOffers || 0;

  return (
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
        Dashboard Overview
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
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl"
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
          {/* Bookings Card */}
          <motion.div
            className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
          >
            <div className="p-3 bg-blue-700 text-white rounded-full">
              <BarChart3 size={28} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Total Bookings
              </h2>
              <motion.p
                className="text-3xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {bookingLength}
              </motion.p>
            </div>
          </motion.div>

          {/* Offers Card */}
          <motion.div
            className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
          >
            <div className="p-3 bg-primary text-white rounded-full">
              <FileText size={28} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Total Offers
              </h2>
              <motion.p
                className="text-3xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {offersLength}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
