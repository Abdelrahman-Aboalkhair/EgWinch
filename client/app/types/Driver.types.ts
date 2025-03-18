export interface PersonalInfo {
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  gender?: "male" | "female" | "other";
  experienceYears?: number;
  licenseInfo?: {
    number: string;
    expiry: string;
  };
}

export interface VehicleInfo {
  model?: string;
  type?: "winch" | "tow truck" | "flatbed";
  plateNumber?: string;
  color?: string;
}

export interface Documents {
  profilePicture?: { public_id: string; secure_url: string };
  licenseImage?: { public_id: string; secure_url: string };
  vehicleImage?: { public_id: string; secure_url: string };
}

export interface DriverState {
  id: string;
  onboardingStep: "personal" | "vehicle" | "documents" | "completed";
  step: number;
  status: "pending" | "inProgress" | "approved" | "rejected";
  rejectionReason?: string;
  location: { coordinates: [number, number] };
  isAvailable: boolean;
  personalInfo?: PersonalInfo;
  vehicleInfo?: VehicleInfo;
  documents?: Documents;
}
