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
} from "../../store/apis/NotificationApi";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "warning";
  isRead: boolean;
}

const Navbar = () => {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { data, isLoading, refetch } = useGetNotificationsQuery(
    {},
    { skip: !notificationsOpen || !isLoggedIn }
  );
  const notifications = data?.notifications || [];
  const [clearAll] = useClearNotificationsMutation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !notificationRef.current?.contains(event.target as Node)
      ) {
        setMenuOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center pt-8">
      <div className="text-2xl font-semibold">
        <Link href="/">
          <span className="cursor-pointer">EgWinch</span>
        </Link>
      </div>
      <div className="space-x-[4rem] text-[16px] ">
        {isLoggedIn && (
          <>
            <Link
              href="/driver-onboarding"
              className={`${
                pathname === "/driver-onboarding"
                  ? "text-primary font-medium"
                  : "text-gray-500"
              }`}
            >
              Start Driving
            </Link>
            <Link
              href="/bookings"
              className={`${
                pathname === "/bookings"
                  ? "text-primary font-medium"
                  : "text-gray-500"
              }`}
            >
              Bookings
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-10">
        <div className="relative" ref={notificationRef}>
          {isLoggedIn && (
            <button
              className="relative mt-2"
              onClick={(e) => {
                e.stopPropagation();
                setNotificationsOpen((prev) => !prev);
                setMenuOpen(false);
                if (!notificationsOpen) refetch();
              }}
            >
              <Bell size={23} />
              {notifications.some((n: Notification) => !n.isRead) && (
                <div className="absolute top-0 right-0 w-[10px] h-[10px] bg-red-600 rounded-full" />
              )}
            </button>
          )}

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-3 z-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={async () => {
                      try {
                        await clearAll({});
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
              ) : notifications.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.map((notification: Notification) => (
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
          <div className="relative flex items-center gap-8" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
                setNotificationsOpen(false);
              }}
            >
              {user?.profilePicture?.secure_url ? (
                <Image
                  src={user.profilePicture.secure_url}
                  alt="User Profile"
                  className="rounded-full cursor-pointer"
                  width={40}
                  height={40}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <User
                  size={40}
                  className="rounded-full cursor-pointer bg-gray-200 p-2"
                />
              )}
            </button>

            {menuOpen && (
              <UserMenu
                menuOpen={menuOpen}
                closeMenu={() => setMenuOpen(false)}
              />
            )}
          </div>
        ) : (
          <Link
            className="border-2 border-primary text-primary px-[1.5rem] font-semibold py-[9px] text-[16px] rounded-full hover:opacity-90"
            href="/sign-in"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
