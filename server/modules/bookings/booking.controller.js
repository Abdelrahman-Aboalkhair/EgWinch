const axios = require("axios");
const BookingService = require("./booking.service");
const asyncHandler = require("../../utils/asyncHandler");

exports.getAllBookings = asyncHandler(async (req, res) => {
  const result = await BookingService.getAllBookings(req.query);

  res.status(200).json({
    success: true,
    message: "All Bookings retrieved successfully",
    ...result,
  });
});

exports.getUserBookings = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const result = await BookingService.getUserBookings(userId, req.query);
  console.log("result: ", result);

  res.status(200).json({
    success: true,
    message: "Bookings retrieved successfully",
    ...result,
  });
});

exports.createBooking = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { pickupLocation, dropoffLocation } = req.body;
  const booking = await BookingService.createBooking({
    userId,
    pickupLocation,
    dropoffLocation,
  });
  res.status(201).json(booking);
});

exports.updateStep = asyncHandler(async (req, res) => {
  console.log("req.body: ", req.body);
  const { step } = req.params;
  const booking = await BookingService.updateBookingStep(
    req.body.bookingId,
    step,
    req.body
  );
  res.status(200).json(booking);
});

exports.completeBooking = asyncHandler(async (req, res) => {
  const booking = await BookingService.completeBooking(req.body.bookingId);
  res.status(200).json(booking);
});

exports.estimatePrice = asyncHandler(async (req, res) => {
  const {
    distance_km,
    items_count,
    pickup_floor,
    dropoff_floor,
    fragile_items,
    additional_services,
  } = req.body;

  const response = await axios.post(
    "http://model_service:5001/predict_move_price",
    {
      distance_km,
      items_count,
      pickup_floor,
      dropoff_floor,
      fragile_items,
      additional_services,
    }
  );

  res.json(response.data);
});

exports.createOffer = asyncHandler(async (req, res) => {
  const { price } = req.body;
  const { bookingId } = req.params;
  const driverId = req.user.userId;

  const offer = await BookingService.createOffer(driverId, bookingId, price);

  res.status(201).json({
    success: true,
    message: "Offer sent successfully",
    offer,
  });
});

exports.updateBooking = asyncHandler(async (req, res) => {
  const { id: bookingId } = req.params;
  const { status, totalPrice, driverId, paymentStatus, action } = req.body;
  const userId = req.user.userId;
  const role = req.user.role;

  const result = await BookingService.updateBooking(bookingId, userId, role, {
    status,
    totalPrice,
    driverId,
    paymentStatus,
    action,
  });

  res.status(200).json({
    success: true,
    message: result.message,
    booking: result.booking,
  });
});

exports.deleteBooking = asyncHandler(async (req, res) => {
  const { id: bookingId } = req.params;
  const { userId } = req.user;

  const result = await BookingService.deleteBooking(bookingId, userId);

  res.status(200).json({ success: true, message: result.message });
});
