"use client";

const useFormatPrice = () => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return formatPrice;
};

export default useFormatPrice;
