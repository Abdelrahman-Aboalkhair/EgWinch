import {
  BookingState,
  Item,
  Location,
  Offer,
  Service,
} from "@/app/types/Booking.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const loadState = (): BookingState => {
  if (typeof window !== "undefined") {
    const storedState = localStorage.getItem("bookingState");
    return storedState ? JSON.parse(storedState) : null;
  }
  return null;
};

const initialState: BookingState = loadState() || {
  step: 1,
  onboardingStep: "location",
  pickup: {
    coordinates: [0, 0],
    address: "",
    floorNumber: 0,
  },
  dropoff: {
    coordinates: [0, 0],
    address: "",
    floorNumber: 0,
  },
  status: "pending",
  items: [],
  services: [] as Service[],
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
    updateLocations: (state, action: PayloadAction<Location>) => {
      state.pickup = action.payload.pickup;
      state.dropoff = action.payload.dropoff;
    },
    updateMoveDate: (state, action: PayloadAction<string>) => {
      state.moveDate = action.payload;
    },
    updateItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },
    updateServices: (state, action: PayloadAction<Service[]>) => {
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
        localStorage.removeItem("bookingState");
      }
    },
  },
});

export const persistBookingStateMiddleware =
  (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "bookingState",
        JSON.stringify(store.getState().booking)
      );
    }
    return result;
  };

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
