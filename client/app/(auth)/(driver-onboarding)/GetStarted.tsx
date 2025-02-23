import { useStartOnboardingMutation } from "@/app/libs/features/apis/DriverApi";
import {
  nextStep,
  setUserId,
} from "@/app/libs/features/slices/DriverOnboardingSlice";
import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";

const GetStarted = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [startOnboarding, { data, error, isLoading }] =
    useStartOnboardingMutation();
  console.log("data: ", data);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (error) {
    console.log("error: ", error);
  }

  const handleStartOnboarding = async () => {
    try {
      await startOnboarding({}).unwrap();
      dispatch(setUserId(user?.id));
      dispatch(nextStep());
    } catch (error) {
      console.error("Application start error:", error);
    }
  };
  return (
    <div className="flex items-center justify-center text-center min-h-[70vh] p-6">
      <div className="max-w-5xl w-full rounded-2xl flex overflow-hidden ">
        {/* Left side - Text */}
        <div className="w-full p-10 flex flex-col justify-center">
          <h1 className="text-[45px] font-bold text-gray-800">
            Move Smarter with Egwinch
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Easily connect with professional winch drivers and move your items
            stress-free. Get started today and experience seamless
            transportation!
          </p>
          <button
            onClick={handleStartOnboarding}
            className="mt-6 w-[20%] mx-auto py-3 bg-primary text-white font-semibold rounded shadow-md hover:opacity-90 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
