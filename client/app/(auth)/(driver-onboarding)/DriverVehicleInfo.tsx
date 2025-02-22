import DatePicker from "@/app/components/custom/DatePicker";
import Dropdown from "@/app/components/custom/Dropdown";
import Input from "@/app/components/custom/Input";
import React from "react";

const DriverVehicleInfo = ({ register, errors, control, setValue }: any) => {
  return (
    <>
      <Input
        name="vehicleType"
        type="text"
        placeholder="Vehicle Type"
        register={register}
        validation={{ required: "Vehicle Type is required" }}
        error={errors.vehicleType?.message}
        className="py-[15px]"
      />
      <DatePicker name="vehicleModal" control={control} label="Vehicle Model" />

      <DatePicker
        name="licenseExpiry"
        control={control}
        label="License Expiry Date"
      />

      <Input
        name="licenseNumber"
        type="text"
        placeholder="License Number"
        register={register}
        validation={{ required: "License Number is required" }}
        error={errors.licenseNumber?.message}
        className="py-[15px]"
      />

      <Input
        name="plateNumber"
        type="text"
        placeholder="Plate Number"
        register={register}
        validation={{ required: "Plate Number is required" }}
        error={errors.plateNumber?.message}
        className="py-[15px]"
      />

      <Dropdown
        options={["Red", "Blue", "Green", "Yellow", "Black", "White"]}
        label="vehicle color"
        onSelect={(value) => setValue("vehicleColor", value)}
        onClear={() => setValue("vehicleColor", "")}
      />
    </>
  );
};

export default DriverVehicleInfo;
