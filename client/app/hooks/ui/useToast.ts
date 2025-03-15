import { useDispatch } from "react-redux";
import { addToast, removeToast, Toast } from "@/app/store/slices/ToastSlice";

const useToast = () => {
  const dispatch = useDispatch();

  const showToast = (message: string, type: Toast["type"]) => {
    dispatch(addToast({ message, type }));
  };

  const dismissToast = (id: string) => {
    dispatch(removeToast(id));
  };

  return { showToast, dismissToast };
};

export default useToast;
