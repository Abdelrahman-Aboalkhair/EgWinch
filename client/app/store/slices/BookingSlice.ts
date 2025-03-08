import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookingState {
  step: number;
  bookingId?: string;
  pickup: { location: string; floor: number; access: string };
  dropoff: { location: string; floor: number; access: string };
  items: { count: number; fragile: boolean; instructions?: string };
  services: string[];
  estimatedPrice?: number;
}

const savedStep =
  typeof window !== "undefined" ? localStorage.getItem("bookingStep") : null;
const initialState: BookingState = {
  step: savedStep ? JSON.parse(savedStep) : 1,
  pickup: { location: "", floor: 0, access: "elevator" },
  dropoff: { location: "", floor: 0, access: "elevator" },
  items: { count: 0, fragile: false },
  services: [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    updateStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("bookingStep", JSON.stringify(action.payload));
      }
    },
    updateLocations: (
      state,
      action: PayloadAction<{
        pickup: BookingState["pickup"];
        dropoff: BookingState["dropoff"];
      }>
    ) => {
      state.pickup = action.payload.pickup;
      state.dropoff = action.payload.dropoff;
    },
    updateItems: (state, action: PayloadAction<BookingState["items"]>) => {
      state.items = action.payload;
    },
    updateServices: (state, action: PayloadAction<string[]>) => {
      state.services = action.payload;
    },
    setEstimatedPrice: (state, action: PayloadAction<number>) => {
      state.estimatedPrice = action.payload;
    },
    resetBooking: (state) => {
      Object.assign(state, initialState);
      if (typeof window !== "undefined") {
        localStorage.removeItem("bookingStep");
      }
    },
  },
});

export const {
  updateStep,
  updateLocations,
  updateItems,
  updateServices,
  setEstimatedPrice,
  resetBooking,
} = bookingSlice.actions;
export default bookingSlice.reducer;
