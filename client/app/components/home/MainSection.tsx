import Image from "next/image";
import WinchImage from "../../assets/home/winch_image.svg";
import Link from "next/link";

const MainSection = () => {
  return (
    <main className="relative flex items-center justify-between min-h-[85vh]">
      <div className="relative w-full h-[740px]">
        <Image
          src={WinchImage}
          alt="Winch Image"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-primary opacity-50" />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <h1 className="text-5xl font-extrabold mb-4">
          EgWinch Your Ultimate Moving Companion
        </h1>
        <p className="text-lg mb-6 text-gray-100 font-medium">
          Moving doesn’t have to be stressful. With EgWinch, you get reliable
          winch services at your fingertips, ensuring a smooth and hassle-free
          relocation experience from start to finish.
        </p>
        <div className="space-x-[7px]">
          <Link
            href={"/book-move"}
            className="bg-primary text-white px-12 py-3  rounded-md font-medium"
          >
            Book Now
          </Link>
          <Link
            href={"/auth/driver-sign-up"}
            className="bg-secondary text-black px-12 py-3 rounded-md font-medium"
          >
            Join us
          </Link>
        </div>
      </div>
    </main>
  );
};

export default MainSection;
