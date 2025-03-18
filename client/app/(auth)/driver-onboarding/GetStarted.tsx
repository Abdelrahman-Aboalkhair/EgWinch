import Button from "@/app/components/atoms/Button";

const GetStarted = ({ onStart }) => {
  return (
    <div className="flex items-center justify-center text-center min-h-[70vh] p-6">
      <div className="max-w-5xl w-full rounded-2xl flex overflow-hidden ">
        <div className="w-full p-10 flex flex-col justify-center">
          <h1 className="text-[55px] font-bold text-gray-800 tracking-wide">
            Join EgWinch – Drive & Earn!
          </h1>
          <p className="text-gray-600 mt-2 mb-4 text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
            inventore nemo voluptate placeat culpa vel beatae aliquid animi
            nihil molestiae.
          </p>
          <Button
            onClick={onStart}
            className="mt-6 w-[20%] mx-auto py-3 bg-primary text-white font-medium"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
