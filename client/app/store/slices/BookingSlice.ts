import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Item {
  name: string;
  category?: string;
  quantity: number;
  fragile: boolean;
  specialInstructions?: string;
  additionalService?: string;
}

interface Offer {
  driver: string;
  price: number;
  status: "pending" | "negotiating" | "accepted" | "declined";
}

interface Location {
  coordinates: [number, number];
  address: string;
  floorNumber: number;
}

interface BookingState {
  step: number;
  bookingId?: string;
  user?: string;
  driver?: string;
  onboardingStep: "location" | "items" | "services" | "completed";
  pickup: Location;
  dropoff: Location;
  moveDate?: string;
  status: "pending" | "inProgress" | "completed" | "declined";
  items: Item[];
  services: string[];
  offers: Offer[];
  totalPrice?: number;
  paymentStatus: "pending" | "paid" | "failed";
}

const initialState: BookingState = {
  step: 1,
  onboardingStep: "location",
  pickup: { coordinates: [0, 0], address: "", floorNumber: 0 },
  dropoff: { coordinates: [0, 0], address: "", floorNumber: 0 },
  status: "pending",
  items: [],
  services: [],
  offers: [],
  paymentStatus: "pending",
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    updateStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    updateOnboardingStep: (
      state,
      action: PayloadAction<BookingState["onboardingStep"]>
    ) => {
      state.onboardingStep = action.payload;
    },
    updateLocations: (
      state,
      action: PayloadAction<{ pickup: Location; dropoff: Location }>
    ) => {
      state.pickup = action.payload.pickup;
      state.dropoff = action.payload.dropoff;
    },
    updateMoveDate: (state, action: PayloadAction<string>) => {
      state.moveDate = action.payload;
    },
    updateItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },
    updateServices: (state, action: PayloadAction<string[]>) => {
      state.services = action.payload;
    },
    updateOffers: (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload;
    },
    updateStatus: (state, action: PayloadAction<BookingState["status"]>) => {
      state.status = action.payload;
    },
    setEstimatedPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload;
    },
    setPaymentStatus: (
      state,
      action: PayloadAction<BookingState["paymentStatus"]>
    ) => {
      state.paymentStatus = action.payload;
    },
    setBookingId: (state, action: PayloadAction<string>) => {
      state.bookingId = action.payload;
    },
    setUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
    setDriver: (state, action: PayloadAction<string>) => {
      state.driver = action.payload;
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
  updateOnboardingStep,
  updateLocations,
  updateMoveDate,
  updateItems,
  updateServices,
  updateOffers,
  updateStatus,
  setEstimatedPrice,
  setPaymentStatus,
  setBookingId,
  setUser,
  setDriver,
  resetBooking,
} = bookingSlice.actions;
export default bookingSlice.reducer;
