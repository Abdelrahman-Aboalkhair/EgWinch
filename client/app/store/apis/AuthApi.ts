import { apiSlice } from "../slices/ApiSlice";
import { clearAuthState, setCredentials, User } from "../slices/AuthSlice";

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

    validateSession: builder.query<{ user: User; accessToken: string }, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          console.log("error: ", error);
          dispatch(clearAuthState());
        }
      },
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
  useValidateSessionQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
