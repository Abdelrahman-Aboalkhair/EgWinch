"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/app/libs/hooks";
import Image from "next/image";
import UserMenu from "./UserMenu";
import UserIcon from "../../assets/user.png";

const Navbar = () => {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
        <Link href="/driver-sign-up" className={linkClass("/driver-sign-up")}>
          Own a Winch?
        </Link>
      </div>

      <div className="flex items-center gap-6 px-[10rem]">
        <Link href="/support" className="text-lg">
          Support
        </Link>
        {isLoggedIn ? (
          <div className="relative profile-menu">
            {user?.profilePicture?.secure_url !== (null || undefined) ? (
              <Image
                src={user?.profilePicture?.secure_url}
                alt="User Profile"
                className="rounded-full cursor-pointer"
                width={38}
                height={38}
                onClick={() => setMenuOpen(!menuOpen)}
              />
            ) : (
              <Image
                src={UserIcon}
                alt="User Profile"
                className="rounded-full cursor-pointer"
                width={38}
                height={38}
                onClick={() => setMenuOpen(!menuOpen)}
              />
            )}

            {menuOpen && <UserMenu menuOpen={menuOpen} closeMenu={closeMenu} />}
          </div>
        ) : (
          <Link href="/sign-in" className="text-lg">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
