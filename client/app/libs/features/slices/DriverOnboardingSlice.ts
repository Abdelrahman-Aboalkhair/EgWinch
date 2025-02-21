import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DriverOnboardingState {
  step: number;
  personalInfo: {
    name: string;
    phone: string;
    address: string;
    experienceYears: number;
  };
  vehicleInfo: {
    type: string;
    licenseNumber: string;
    licenseExpiry: Date;
  };
  documents: {
    licenseImage: string;
    profilePicture: string;
  };
}

const initialState: DriverOnboardingState = {
  step: 1,
  personalInfo: { name: "", phone: "", address: "", experienceYears: 0 },
  vehicleInfo: { type: "", licenseNumber: "", licenseExpiry: new Date() },
  documents: { licenseImage: "", profilePicture: "" },
};

const driverOnboardingSlice = createSlice({
  name: "driverOnboarding",
  initialState,
  reducers: {
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      state.step -= 1;
    },
    setPersonalInfo: (
      state,
      action: PayloadAction<DriverOnboardingState["personalInfo"]>
    ) => {
      state.personalInfo = action.payload;
    },
    setVehicleInfo: (
      state,
      action: PayloadAction<DriverOnboardingState["vehicleInfo"]>
    ) => {
      state.vehicleInfo = action.payload;
    },
    setDocuments: (
      state,
      action: PayloadAction<DriverOnboardingState["documents"]>
    ) => {
      state.documents = action.payload;
    },
    resetOnboarding: () => initialState,
  },
});

export const {
  nextStep,
  prevStep,
  setPersonalInfo,
  setVehicleInfo,
  setDocuments,
  resetOnboarding,
} = driverOnboardingSlice.actions;

export default driverOnboardingSlice.reducer;
