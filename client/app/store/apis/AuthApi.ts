import { User } from "@/app/types/Auth.types";
import { apiSlice } from "../slices/ApiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<
      { user: User; accessToken: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation<{ user: User; accessToken: string }, FormData>({
      query: (data) => ({
        url: "/auth/sign-up",
        method: "POST",
        body: data,
      }),
    }),
    registerDriver: builder.mutation<
      { user: User; accessToken: string },
      {
        email: string;
        password: string;
        name: string;
        phoneNumber: string;
        address: string;
        licenseNumber: string;
        licenseExpiry: string;
        licenseImage: string;
        vehicleType: string;
        experienceYears: number;
        profilePicture: string;
      }
    >({
      query: (data) => ({
        url: "/auth/register-driver",
        method: "POST",
        body: data,
      }),
    }),
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/sign-out",
        method: "GET",
      }),
    }),

    verifyEmail: builder.mutation<void, { emailVerificationCode: string }>({
      query: ({ emailVerificationCode }) => {
        return {
          url: "/auth/verify-email",
          method: "POST",
          body: { emailVerificationCode },
        };
      },
    }),

    forgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => {
        return {
          url: "/auth/forgot-password",
          method: "POST",
          body: { email },
        };
      },
    }),

    resetPassword: builder.mutation<
      void,
      { token: string; newPassword: string }
    >({
      query: ({ token, newPassword }) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: { newPassword, token },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSignupMutation,
  useRegisterDriverMutation,
  useSignOutMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
