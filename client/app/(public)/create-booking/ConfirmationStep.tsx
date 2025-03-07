import { useDispatch, useSelector } from "react-redux";
import { useEstimatePriceMutation } from "@/app/store/apis/BookingApi";
import { setEstimatedPrice, updateStep } from "@/app/store/slices/BookingSlice";
import { RootState } from "@/app/store/store";

const ConfirmationStep = () => {
  const dispatch = useDispatch();
  const bookingData = useSelector((state: RootState) => state.booking);
  const [estimatePrice, { data }] = useEstimatePriceMutation();

  const handleConfirm = async () => {
    const response = await estimatePrice(bookingData).unwrap();
    dispatch(setEstimatedPrice(response.estimatedPrice));
    dispatch(updateStep(4));
  };

  return (
    <div>
      <h2>Price Estimation</h2>
      <button onClick={handleConfirm}>Estimate Price</button>
      {data && <p>Estimated Price: ${data.estimatedPrice}</p>}
    </div>
  );
};

export default ConfirmationStep;
