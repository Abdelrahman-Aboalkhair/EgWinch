const axios = require("axios");
const BookingService = require("./booking.service");
const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/sendResponse");

exports.getAllBookings = asyncHandler(async (req, res) => {
  const result = await BookingService.getAllBookings(req.query);
  sendResponse(res, 200, result, "All bookings retrieved successfully");
});

exports.getUserBookings = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const result = await BookingService.getUserBookings(userId, req.query);
  sendResponse(res, 200, result, "Bookings retrieved successfully");
});

exports.createBooking = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { pickupLocation, dropoffLocation } = req.body;
  const booking = await BookingService.createBooking({
    userId,
    pickupLocation,
    dropoffLocation,
  });
  sendResponse(res, 201, { booking }, "Booking created successfully");
});

exports.updateStep = asyncHandler(async (req, res) => {
  const { step } = req.params;
  const booking = await BookingService.updateBookingStep(
    req.body.bookingId,
    step,
    req.body
  );
  sendResponse(res, 200, { booking }, "Booking step updated successfully");
});

exports.estimatePrice = asyncHandler(async (req, res) => {
  const response = await axios.post(
    "http://model_service:5001/predict_move_price",
    req.body
  );
  sendResponse(res, 200, response.data, "Price estimated successfully");
});

exports.createOffer = asyncHandler(async (req, res) => {
  const { price } = req.body;
  const { bookingId } = req.params;
  const driverId = req.user.userId;
  const offer = await BookingService.createOffer(driverId, bookingId, price);
  sendResponse(res, 201, { offer }, "Offer sent successfully");
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

  sendResponse(res, 200, { booking: result.booking }, result.message);
});

exports.deleteBooking = asyncHandler(async (req, res) => {
  const { id: bookingId } = req.params;
  const { userId } = req.user;
  const result = await BookingService.deleteBooking(bookingId, userId);
  sendResponse(res, 200, {}, result.message);
});
