import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateServices, updateStep } from "@/app/store/slices/BookingSlice";

const ServicesStep = () => {
  const dispatch = useDispatch();
  const [services, setServices] = useState<string[]>([]);

  const handleNext = () => {
    dispatch(updateServices(services));
    dispatch(updateStep(3));
  };

  return (
    <div>
      <h2>Additional Services</h2>
      <label>
        <input
          type="checkbox"
          onChange={(e) =>
            e.target.checked && setServices([...services, "Carpentry"])
          }
        />
        Carpentry
      </label>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default ServicesStep;
