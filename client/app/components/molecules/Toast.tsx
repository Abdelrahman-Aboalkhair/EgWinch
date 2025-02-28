"use client";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { removeToast } from "../../store/slices/ToastSlice";
import { useEffect } from "react";
import { X, Check, CircleAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const toastStyles = {
  success: {
    icon: (
      <Check
        className="text-white bg-primary p-[5px] w-[23px] h-[23px] rounded-full"
        size={22}
      />
    ),
  },
  error: {
    icon: (
      <X
        className="text-gray-700 bg-red-500 p-[5px] w-[23px] h-[23px] rounded-full"
        size={24}
      />
    ),
  },
  warning: {
    icon: (
      <CircleAlert
        className="text-yellow-700 p-[5px] w-[23px] h-[23px] rounded-full"
        size={27}
      />
    ),
  },
};

const Toast = () => {
  const dispatch = useAppDispatch();
  const { toasts } = useAppSelector((state) => state.toasts);

  useEffect(() => {
    toasts.forEach((toast) => {
      setTimeout(() => dispatch(removeToast(toast.id)), 5000);
    });
  }, [toasts, dispatch]);

  return (
    <div className="fixed bottom-5 left-5 flex flex-col gap-2 z-[2000]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            exit={{ opacity: 0, y: 20 }}
            className={`relative flex items-center gap-3 max-w-[350px] min-w-[320px] px-8 py-[20px] rounded-md shadow-md bg-gray-50 backdrop-blur-lg border border-gray-200`}
          >
            {toastStyles[toast.type].icon}
            <span className="flex-1 font-medium capitalize">
              {toast.message}
            </span>
            <button
              className="text-black absolute top-[8px] right-[8px]"
              onClick={() => dispatch(removeToast(toast.id))}
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
