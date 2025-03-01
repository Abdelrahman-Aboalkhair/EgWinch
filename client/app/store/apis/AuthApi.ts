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
    registerCustomer: builder.mutation<
      { user: User; accessToken: string },
      FormData
    >({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: formData,
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
  useRegisterCustomerMutation,
  useRegisterDriverMutation,
  useSignOutMutation,
  useVerifyEmailMutation,
  useValidateSessionQuery,
} = authApi;
