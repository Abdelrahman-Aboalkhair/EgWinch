import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

// Define step mapping
const stepMapping: Record<number, string> = {
  0: "get_started",
  1: "personal_info",
  2: "vehicle_info",
  3: "documents",
};

const getStorageKey = (userId: string) => `driverStep_${userId}`;

const loadStepForUser = (userId: string) => {
  const savedStep =
    Number(localStorage.getItem(`${getStorageKey(userId)}`)) || 1;
  return {
    step: savedStep,
    stepName: stepMapping[savedStep] || "get_started",
  };
};

interface DriverOnboardingState {
  step: number;
  stepName: string;
  userId: string | null;
}

const initialState: DriverOnboardingState = {
  step: 0,
  stepName: "get_started",
  userId: null,
};

const driverOnboardingSlice = createSlice({
  name: "driverOnboarding",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
      if (action.payload) {
        const { step, stepName } = loadStepForUser(action.payload);
        state.step = step;
        state.stepName = stepName;
      }
    },
    nextStep: (state) => {
      if (state.userId && state.step < Object.keys(stepMapping).length - 1) {
        state.step += 1;
        state.stepName = stepMapping[state.step];
        localStorage.setItem(getStorageKey(state.userId), String(state.step));
      }
    },
    prevStep: (state) => {
      if (state.userId && state.step > 1) {
        state.step -= 1;
        state.stepName = stepMapping[state.step];
        localStorage.setItem(getStorageKey(state.userId), String(state.step));
      }
    },
    setStep: (state, action: PayloadAction<number>) => {
      if (state.userId && stepMapping[action.payload]) {
        state.step = action.payload;
        state.stepName = stepMapping[action.payload];
        localStorage.setItem(getStorageKey(state.userId), String(state.step));
      }
    },
    resetOnboarding: (state) => {
      if (state.userId) {
        state.step = 1;
        state.stepName = stepMapping[1];
        localStorage.removeItem(getStorageKey(state.userId));
      }
    },
  },
});

export const { setUserId, nextStep, prevStep, setStep, resetOnboarding } =
  driverOnboardingSlice.actions;

export const selectOnboardingStep = (state: RootState) =>
  state.driverOnboarding.step;
export const selectOnboardingStepName = (state: RootState) =>
  state.driverOnboarding.stepName;

export default driverOnboardingSlice.reducer;
