export interface Item {
  name: string;
  category: string;
  quantity: number;
  fragile?: boolean;
  specialInstructions?: string;
  additionalService?: string;
}

export interface Service {
  name: string;
  details: string;
}

export interface Offer {
  driver: string;
  price: number;
  status: "pending" | "negotiating" | "accepted" | "declined";
}

interface Location {
  pickup: LocationPoint;
  dropoff: LocationPoint;
}

interface LocationPoint {
  coordinates: [number, number];
  address: string;
  floorNumber: number;
}

export interface BookingState {
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
