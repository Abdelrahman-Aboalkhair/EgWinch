import React from "react";
import Notification from "./Notification";
import { Notification as NotificationType } from "../../context/NotificationContext";

const NotificationContainer = ({
  notifications,
}: {
  notifications: NotificationType[];
}) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-4 z-50">
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;
