import { apiSlice } from "../slices/ApiSlice";
import { User } from "../slices/AuthSlice";

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
    signUp: builder.mutation<
      { user: User; accessToken: string },
      { email: string; password: string; name: string; phoneNumber: string }
    >({
      query: (data) => ({
        url: "/auth/sign-up",
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

    verifyEmail: builder.mutation<void, { emailVerificationToken: string }>({
      query: ({ emailVerificationToken }) => {
        return {
          url: "/auth/verify-email",
          method: "POST",
          body: { emailVerificationToken },
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
  useSignUpMutation,
  useSignOutMutation,
  useVerifyEmailMutation,
} = authApi;
