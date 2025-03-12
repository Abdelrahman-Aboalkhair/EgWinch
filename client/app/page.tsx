"use client";
import TruckImage from "./assets/images/truck.png";
import Link from "next/link";
import Button from "./components/atoms/Button";
import { useAppSelector } from "./store/hooks";
import MainLayout from "./components/templates/MainLayout";
import Image from "next/image";

const Home = () => {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;

  const buttonConfig: Record<string, { href: string; text: string }> = {
    driver: { href: "/jobs", text: "Find Jobs" },
    admin: { href: "/dashboard", text: "Dashboard" },
    "super-admin": { href: "/dashboard", text: "Dashboard" },
  };

  const { href, text } = buttonConfig[role] || {
    href: "/create-booking",
    text: "Book Now",
  };

  return (
    <MainLayout>
      <main className="flex items-center justify-between pt-[7%]">
        <div className="flex flex-col items-start justify-center gap-4">
          <div className="pb-4 space-y-2">
            <h1 className="text-[50px] font-bold text-stone-800 w-[50rem] leading-[68px]">
              Move Smart, Move Easy with
              <span className="text-primary ml-2">Egwinch</span>
            </h1>
            <p className="w-[555px] text-[18px] text-gray-700">
              Find reliable winch drivers, get instant price offers, and move
              hassle-free—all in one app.
            </p>
          </div>

          <Button className="bg-primary text-white px-[3rem] py-[12px] text-[15px] font-medium rounded">
            <Link href={href}>{text}</Link>
          </Button>
        </div>

        <Image src={TruckImage} width={530} height={500} alt="Truck image" />
      </main>
    </MainLayout>
  );
};

export default Home;
