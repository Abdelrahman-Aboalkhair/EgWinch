"use client";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  LayoutDashboard,
  PanelsRightBottom,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useStorage from "../../hooks/useStorage";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Manage Bookings", href: "/manage-bookings", icon: Briefcase },
  { name: "Manage Users", href: "/manage-users", icon: Users },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useStorage<boolean>("sidebarOpen", true, "local");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 80 }}
        animate={{
          width: isOpen ? 260 : 80,
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        className="bg-white shadow-lg text-black h-full flex flex-col p-4 border-r"
      >
        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-6 flex items-center"
        >
          <PanelsRightBottom size={28} className="text-black cursor-pointer" />
        </button>

        {/* Sidebar Links */}
        <nav className="flex flex-col space-y-3">
          {sidebarLinks.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={name}
                href={href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isActive && isOpen
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-6 flex justify-center ${
                    isActive && !isOpen ? "text-green-700" : ""
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                {isOpen && <span className="text-[15px]">{name}</span>}
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
