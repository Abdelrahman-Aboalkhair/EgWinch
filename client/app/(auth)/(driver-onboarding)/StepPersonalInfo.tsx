import { setPersonalInfo } from "@/app/libs/features/slices/DriverOnboardingSlice";
import { useAppDispatch, useAppSelector } from "@/app/libs/hooks";

const StepPersonalInfo = () => {
  const dispatch = useAppDispatch();
  const { name, phone, address, experienceYears } = useAppSelector(
    (state) => state.driverOnboarding.personalInfo
  );

  return (
    <div>
      <input
        type="text"
        value={name}
        placeholder="Full Name"
        onChange={(e) =>
          dispatch(
            setPersonalInfo({
              name: e.target.value,
              phone,
              address,
              experienceYears,
            })
          )
        }
      />
      <input
        type="text"
        value={phone}
        placeholder="Phone"
        onChange={(e) =>
          dispatch(
            setPersonalInfo({
              name,
              phone: e.target.value,
              address,
              experienceYears,
            })
          )
        }
      />
      <input
        type="text"
        value={address}
        placeholder="Address"
        onChange={(e) =>
          dispatch(
            setPersonalInfo({
              name,
              phone,
              address: e.target.value,
              experienceYears,
            })
          )
        }
      />
    </div>
  );
};

export default StepPersonalInfo;
