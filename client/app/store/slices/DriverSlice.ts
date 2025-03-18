import {
  DriverState,
  Documents,
  PersonalInfo,
  VehicleInfo,
} from "@/app/types/Driver.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const loadState = (): DriverState | null => {
  if (typeof window !== "undefined") {
    const storedState = sessionStorage.getItem("driverState");
    return storedState ? JSON.parse(storedState) : null;
  }
  return null;
};

const initialState: DriverState = loadState() || {
  id: "",
  onboardingStep: "personal",
  step: 1,
  status: "pending",
  location: { coordinates: [0, 0] },
  isAvailable: false,
};

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    updateStep: (state, action: PayloadAction<DriverState["step"]>) => {
      state.step = action.payload;
    },
    setDriverId: (state, action: PayloadAction<string>) => {
      console.log("action.payload: ", action.payload);
      state.id = action.payload;
    },
    updatePersonalInfo: (state, action: PayloadAction<PersonalInfo>) => {
      state.personalInfo = action.payload;
    },
    updateVehicleInfo: (state, action: PayloadAction<VehicleInfo>) => {
      state.vehicleInfo = action.payload;
    },
    updateDocuments: (state, action: PayloadAction<Documents>) => {
      state.documents = action.payload;
    },
  },
});

export const persistDriverStateMiddleware =
  (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "driverState",
        JSON.stringify(store.getState().driver)
      );
    }
    return result;
  };

export const {
  updateStep,
  setDriverId,
  updatePersonalInfo,
  updateVehicleInfo,
  updateDocuments,
} = driverSlice.actions;

export default driverSlice.reducer;
