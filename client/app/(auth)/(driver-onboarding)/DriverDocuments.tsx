import Input from "@/app/components/custom/Input";

const DriverDocuments = ({ register, errors, setValue }: any) => {
  return (
    <>
      <Input
        name="licenseImage"
        type="file"
        placeholder="License Image"
        setValue={setValue}
        register={register}
        validation={{ required: "License Image is required" }}
        error={errors.licenseImage?.message}
        className="py-[15px]"
      />

      <Input
        name="profilePicture"
        type="file"
        placeholder="Profile picture"
        register={register}
        setValue={setValue}
        validation={{
          required: "Profile picture is required",
        }}
        error={errors.profilePicture?.message}
        className="py-[18px]"
      />

      <Input
        name="vehicleImage"
        type="file"
        placeholder="Profile picture"
        register={register}
        setValue={setValue}
        validation={{
          required: "Profile picture is required",
        }}
        error={errors.vehicleImage?.message}
        className="py-[18px]"
      />
    </>
  );
};

export default DriverDocuments;
