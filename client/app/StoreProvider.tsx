"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./libs/store";
import {
  clearAuthState,
  setCredentials,
} from "./libs/features/slices/AuthSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const user = localStorage.getItem("user");

    try {
      if (user) {
        store.dispatch(
          setCredentials({ data: { user: JSON.parse(user), accessToken: "" } })
        );
      } else {
        store.dispatch(clearAuthState());
      }
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
      store.dispatch(clearAuthState());
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
