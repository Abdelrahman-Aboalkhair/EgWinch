import { useAppSelector } from "./useRedux";

const useAuthState = () => {
  const { accessToken } = useAppSelector((state) => state.auth);

  if (!accessToken) {
    return null;
  }

  return { accessToken };
};

export default useAuthState;
