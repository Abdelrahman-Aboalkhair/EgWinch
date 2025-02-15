import React from "react";
import { motion } from "framer-motion";
import { Notification } from "../../context/NotificationContext";

const NotificationComponent = ({
  notification,
}: {
  notification: Notification;
}) => {
  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.5 }}
      className={`${getBackgroundColor(
        notification.type
      )} p-4 mb-4 rounded-lg text-white shadow-md`}
    >
      <p>{notification.message}</p>
    </motion.div>
  );
};

export default NotificationComponent;
