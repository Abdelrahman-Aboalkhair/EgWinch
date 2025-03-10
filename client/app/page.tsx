import Link from "next/link";
import TruckImage from "@/app/assets/images/truck.png";
import Image from "next/image";
import MainLayout from "./components/templates/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <main className="flex items-center justify-between pt-[7%]">
        <div className="flex flex-col items-start justify-center gap-4">
          <div className="pb-4 space-y-1">
            <h1 className="text-[50px] font-bold text-stone-800 w-[50rem] text-wrap">
              Move Smart, Move Easy with
              <span className="text-primary ml-2">Egwinch</span>
            </h1>
            <p className="w-[555px] text-[18px] text-gray-700">
              Find reliable winch drivers, get instant price offers, and move
              hassle-free—all in one app.
            </p>
          </div>
          <Link href={"/create-booking"}>
            <button
              className="bg-primary text-white px-16 font-medium py-[12px] text-[16px] rounded
             hover:opacity-90 active:scale-95"
            >
              Book Now
            </button>
          </Link>
        </div>

        <Image src={TruckImage} width={530} height={500} alt="Truck image" />
      </main>
    </MainLayout>
  );
};

export default Home;
