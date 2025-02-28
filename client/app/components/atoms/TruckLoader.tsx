import animationData from "../../assets/animations/truck-animation.json";
import Lottie from "lottie-react";

const TruckLoader = () => {
  return (
    <div className="flex justify-center items-center h-[250px] w-[250px] ">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default TruckLoader;
