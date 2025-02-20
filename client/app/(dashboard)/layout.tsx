"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  Users,
  Briefcase,
  LayoutDashboard,
  BadgeCent,
  PanelsRightBottom,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Manage Bookings", href: "/manage-bookings", icon: Briefcase },
  { name: "Manage Users", href: "/manage-users", icon: Users },
  { name: "Manage Offers", href: "/manage-offers", icon: BadgeCent },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const linkClass = (path: string) =>
    `text-lg flex items-center gap-3 px-4 py-[12px] rounded-lg font-medium transition-all ${
      pathname === path ? "bg-primary text-white" : "text-black"
    }`;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 70 }}
        animate={{
          width: isOpen ? 250 : 70,
          transition: { duration: 0.2, ease: "easeInOut" },
        }}
        exit={{ width: 70 }}
        className="bg-white shadow-lg text-black h-full flex flex-col p-4"
      >
        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-4 flex items-center"
        >
          <PanelsRightBottom size={28} className="text-black cursor-pointer" />
        </button>

        {/* Sidebar Links */}
        <nav className="flex flex-col space-y-2">
          {sidebarLinks.map(({ name, href, icon: Icon }) => (
            <Link key={name} href={href} className={linkClass(href)}>
              <div className="w-6 flex justify-center">
                <Icon className="h-6 w-6" />
              </div>
              {isOpen && <span className="text-[15px]">{name}</span>}
            </Link>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
