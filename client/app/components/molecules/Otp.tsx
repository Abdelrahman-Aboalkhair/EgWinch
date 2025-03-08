"use client";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";

const OtpInput = ({ setOtp }: { setOtp: (otp: string) => void }) => {
  const { setValue, control, getValues } = useForm<{ otp: string }>({
    defaultValues: { otp: "" },
  });

  const handleChange = (
    index: number,
    value: string,
    moveNext: (index: number) => void
  ) => {
    if (/^\d$/.test(value)) {
      const otpArray = getValues("otp").split("");
      otpArray[index] = value;
      const newOtp = otpArray.join("");
      setValue("otp", newOtp);
      setOtp(newOtp);

      if (index < 3) moveNext(index + 1);
    } else if (value === "") {
      const otpArray = getValues("otp").split("");
      otpArray[index] = "";
      const newOtp = otpArray.join("");
      setValue("otp", newOtp);
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    movePrev: (index: number) => void
  ) => {
    if (e.key === "Backspace") {
      const otpArray = getValues("otp").split("");
      if (!otpArray[index] && index > 0) {
        movePrev(index - 1);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((index) => (
          <Controller
            key={index}
            name="otp"
            control={control}
            render={({ field }) => (
              <motion.input
                ref={field.ref}
                type="text"
                maxLength={1}
                className="w-[65px] h-[55px] text-center text-lg font-bold border-2 border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-primary rounded-md transition-all outline-none"
                value={field.value[index] || ""}
                onChange={(e) =>
                  handleChange(index, e.target.value, (nextIndex) =>
                    document.getElementById(`otp-${nextIndex}`)?.focus()
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(index, e, (prevIndex) =>
                    document.getElementById(`otp-${prevIndex}`)?.focus()
                  )
                }
                id={`otp-${index}`}
                as={motion.input}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              />
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default OtpInput;
