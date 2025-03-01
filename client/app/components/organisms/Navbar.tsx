"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";
import Image from "next/image";
import UserMenu from "../molecules/UserMenu";
import { Bell, User } from "lucide-react";
import {
  useClearNotificationsMutation,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "../../store/apis/NotificationApi";

const Navbar = () => {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useGetNotificationsQuery({});
  const notifications = data?.notifications || [];
  const [markAsRead] = useMarkAsReadMutation();
  const [clearAll] = useClearNotificationsMutation();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsOpen &&
        notificationRef.current &&
        !(notificationRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsOpen]);

  const closeMenu = () => setMenuOpen(false);
  const toggleNotifications = async () => {
    setNotificationsOpen((prev) => !prev);

    if (!notificationsOpen) {
      try {
        await markAsRead();
      } catch (error) {
        console.error("Failed to mark notifications as read", error);
      }
    }
  };

  return (
    <nav className="flex justify-between items-center bg-gray-50 border-b-2 border-gray-200/90 py-6">
      <div className="text-2xl font-semibold px-[10rem]">
        <Link href="/">
          <span className="cursor-pointer">EgWinch</span>
        </Link>
      </div>

      <div className="flex items-center gap-10 px-[10rem]">
        <div className="relative" ref={notificationRef}>
          {isLoggedIn && (
            <button className="relative mt-2" onClick={toggleNotifications}>
              <Bell size={23} />
              {notifications && notifications.some((n: any) => !n.isRead) && (
                <div className="absolute top-0 right-0 w-[10px] h-[10px] bg-red-600 rounded-full" />
              )}
            </button>
          )}

          {notificationsOpen && (
            <div
              key={notifications?.length}
              className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-3 z-50"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Notifications</h3>
                {notifications?.length > 0 && (
                  <button
                    onClick={async () => {
                      try {
                        await clearAll();
                      } catch (error) {
                        console.error("Failed to clear notifications", error);
                      }
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {isLoading ? (
                <p className="text-gray-500 text-xs">Loading...</p>
              ) : notifications?.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.map((notification: any) => (
                    <li
                      key={notification.id}
                      className="text-sm text-gray-700 border-b pb-2"
                    >
                      {notification.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-xs">No new notifications</p>
              )}
            </div>
          )}
        </div>

        {isLoggedIn ? (
          <div
            key={user?.id}
            className="relative profile-menu flex items-center justify-center gap-8"
          >
            {user?.profilePicture?.secure_url ? (
              <Image
                src={user.profilePicture.secure_url}
                alt="User Profile"
                className="rounded-full cursor-pointer"
                width={40}
                height={40}
                onClick={() => setMenuOpen(!menuOpen)}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <User
                size={40}
                className="rounded-full cursor-pointer bg-gray-200 p-2"
                onClick={() => setMenuOpen(!menuOpen)}
              />
            )}
            {menuOpen && <UserMenu menuOpen={menuOpen} closeMenu={closeMenu} />}

            <Link href="/driver-sign-up" className="text-[17px]">
              Start Driving
            </Link>
          </div>
        ) : (
          <Link href="/sign-in" className="text-[17px]">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
