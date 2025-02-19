"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";
import { clearAuthState } from "@/app/libs/features/slices/AuthSlice";
import { useRouter } from "next/navigation";
import { useSignOutMutation } from "@/app/libs/features/apis/AuthApi";
import Image from "next/image";
import { motion } from "framer-motion";

const Navbar = () => {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const [signOut] = useSignOutMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      dispatch(clearAuthState());
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Error occurred while signing out", error);
    }
  };

  const linkClass = (path) =>
    `text-lg ${pathname === path ? "opacity-100" : "opacity-50"}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest(".profile-menu")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="flex justify-between items-center bg-white border-b-2 border-lightText py-6">
      <div className="text-2xl font-semibold px-[10rem]">
        <Link href="/">
          <span className="cursor-pointer">EgWinch</span>
        </Link>
      </div>

      <div className="flex gap-6">
        <Link href="/book-move" className={linkClass("/book-move")}>
          Book a Move
        </Link>
        <Link
          href="/auth/driver-sign-up"
          className={linkClass("/auth/driver-sign-up")}
        >
          Own a Winch?
        </Link>
      </div>

      <div className="flex items-center gap-6 px-[10rem]">
        <Link href="/help" className="text-lg">
          Help
        </Link>
        {isLoggedIn ? (
          <div className="relative profile-menu">
            <Image
              src={user?.profilePicture?.secure_url}
              alt="User Profile"
              className="rounded-full cursor-pointer"
              width={38}
              height={38}
              onClick={() => setMenuOpen(!menuOpen)}
            />

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-gray-100 shadow-md rounded-md z-[2200]"
              >
                <Link
                  href="/"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <Link
                  href="/drivers"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={closeMenu}
                >
                  Avaliable {user?.role === "driver" ? "Customers" : "Drivers"}
                </Link>
                <Link
                  href="/bookings"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={closeMenu}
                >
                  Bookings
                </Link>

                <button
                  onClick={() => {
                    handleSignOut();
                    closeMenu();
                  }}
                  className="block text-left w-full px-4 py-2 hover:bg-gray-200"
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <Link href="/auth/sign-in" className="text-lg">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
