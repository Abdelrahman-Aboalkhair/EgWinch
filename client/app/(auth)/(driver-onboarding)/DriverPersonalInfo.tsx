import DatePicker from "@/app/components/custom/DatePicker";
import Dropdown from "@/app/components/custom/Dropdown";
import Input from "@/app/components/custom/Input";

const DriverPersonalInfo = ({ register, errors, control, setValue }: any) => {
  return (
    <div>
      <Input
        name="phoneNumber"
        type="text"
        placeholder="Phone Number"
        register={register}
        validation={{ required: "Phone Number is required" }}
        error={errors.phoneNumber?.message}
        className="py-[15px]"
      />
      <DatePicker name="dateOfBirth" control={control} label="Date of Birth" />
      <Input
        name="address"
        type="text"
        placeholder="Address"
        register={register}
        validation={{ required: "Address is required" }}
        error={errors.address?.message}
        className="py-[18px]"
      />
      <Dropdown
        options={["male", "female", "other"]}
        label="Gender"
        onSelect={(value) => setValue("gender", value)}
        onClear={() => setValue("gender", "")}
      />
      <Input
        name="experienceYears"
        type="number"
        placeholder="Experience Years"
        register={register}
        validation={{ required: "Experience Years is required" }}
        error={errors.experienceYears?.message}
        className="py-[18px]"
      />
    </div>
  );
};

export default DriverPersonalInfo;
