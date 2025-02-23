import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define step mapping
const stepMapping: Record<number, string> = {
  0: "get_started",
  1: "personal_info",
  2: "vehicle_info",
  3: "documents",
  4: "review",
};

const getStorageKey = (userId?: string): string => {
  return userId
    ? `driverOnboardingStep_${userId}`
    : "driverOnboardingStep_guest";
};

const loadInitialStep = (userId?: string): number => {
  console.log("userId: ", userId);
  try {
    const savedStep = localStorage.getItem(getStorageKey(userId));
    return savedStep ? Number(savedStep) : 0; // Default to "get_started" (step 0)
  } catch (error) {
    return 0;
  }
};

interface DriverOnboardingState {
  step: number;
  stepName: string;
}

const initialState: DriverOnboardingState = {
  step: 0,
  stepName: stepMapping[0],
};

const driverOnboardingSlice = createSlice({
  name: "driverOnboarding",
  initialState,
  reducers: {
    loadStep: (state, action: PayloadAction<{ userId?: string }>) => {
      const userId = action.payload.userId;
      const storedStep = loadInitialStep(userId);
      state.step = storedStep;
      state.stepName = stepMapping[storedStep] || stepMapping[0];
    },
    nextStep: (state, action: PayloadAction<{ userId?: string }>) => {
      const userId = action.payload.userId;
      if (state.step < Object.keys(stepMapping).length - 1) {
        state.step += 1;
        state.stepName = stepMapping[state.step];
        localStorage.setItem(getStorageKey(userId), String(state.step));
      }
    },
    prevStep: (state, action: PayloadAction<{ userId?: string }>) => {
      const userId = action.payload.userId;
      if (state.step > 0) {
        state.step -= 1;
        state.stepName = stepMapping[state.step];
        localStorage.setItem(getStorageKey(userId), String(state.step));
      }
    },
    setStep: (
      state,
      action: PayloadAction<{ step: number; userId?: string }>
    ) => {
      const { step, userId } = action.payload;
      if (stepMapping[step]) {
        state.step = step;
        state.stepName = stepMapping[step];
        localStorage.setItem(getStorageKey(userId), String(step));
      }
    },
    resetOnboarding: (state, action: PayloadAction<{ userId?: string }>) => {
      const userId = action.payload.userId;
      state.step = 0;
      state.stepName = stepMapping[0];
      localStorage.removeItem(getStorageKey(userId));
    },
    logout: (_, action: PayloadAction<{ userId?: string }>) => {
      const userId = action.payload.userId;
      localStorage.removeItem(getStorageKey(userId)); // Clear onboarding progress on logout
    },
  },
});

export const {
  loadStep,
  nextStep,
  prevStep,
  setStep,
  resetOnboarding,
  logout,
} = driverOnboardingSlice.actions;

export default driverOnboardingSlice.reducer;
