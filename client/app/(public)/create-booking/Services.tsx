import { updateServices, updateStep } from "@/app/store/slices/BookingSlice";
import OnboardingLayout from "@/app/components/templates/OnboardingLayout";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useForm } from "react-hook-form";
import additionalServicesOptions from "@/app/constants/additionalServicesOptions";
import { useUpdateOnboardingStepMutation } from "@/app/store/apis/BookingApi";

const Services = () => {
  const { handleSubmit, register } = useForm();
  const { step, bookingId } = useAppSelector((state) => state.booking);
  const [updateOnboardingStep, { error }] = useUpdateOnboardingStepMutation();
  console.log("error: ", error);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: { services: string[] }) => {
    console.log("Selected Services:", data.services);
    try {
      await updateOnboardingStep({
        bookingId,
        step: "services",
        services: data.services,
      });
      dispatch(updateStep(step + 1));
      dispatch(updateServices(data.services));
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleBack = () => {
    dispatch(updateStep(step - 1));
  };

  return (
    <OnboardingLayout currentStep={step}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        <h1 className="text-2xl font-semibold text-primary">
          Additional Services
        </h1>

        <div className="grid grid-cols-2 gap-4">
          {additionalServicesOptions.map((service) => (
            <label
              key={service}
              className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-primary/10"
            >
              <input
                type="checkbox"
                value={service}
                {...register("services")}
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-gray-800">{service}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={handleBack}
            className="border-2 border-primary text-black py-2 px-10 font-medium"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-primary text-white py-[10px] px-12 font-medium active:scale-95 hover:opacity-90"
          >
            Next
          </button>
        </div>
      </form>
    </OnboardingLayout>
  );
};

export default Services;
