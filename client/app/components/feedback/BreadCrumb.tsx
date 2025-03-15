"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const BreadCrumb: React.FC = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  console.log("pathSegments => ", pathSegments);

  return (
    <nav aria-label="breadcrumb" className="p-4">
      <ul className="flex items-center text-sm text-gray-600">
        <li>
          <Link href="/" className="hover:text-blue-500">
            Home
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");

          return (
            <React.Fragment key={href}>
              <span className="mx-2 text-gray-400">/</span>
              <li>
                <Link href={href} className="capitalize hover:text-blue-500">
                  {decodeURIComponent(segment)}
                </Link>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </nav>
  );
};

export default BreadCrumb;
