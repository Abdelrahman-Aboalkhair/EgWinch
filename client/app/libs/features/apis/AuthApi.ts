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

    validateSession: builder.query<{ user: User; accessToken: string }, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("data from validate session: ", data);
          dispatch(setCredentials(data));
        } catch (error) {
          console.error("Session validation failed:", error);
          dispatch(clearAuthState());
        }
      },
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
  useValidateSessionQuery,
} = authApi;
