const Booking = require("../models/Booking");

class BookingService {
  static async createBooking(userId) {
    return await Booking.create({ user: userId });
  }

  static async updateBookingStep(bookingId, step, data) {
    return await Booking.findByIdAndUpdate(
      bookingId,
      { ...data, onboardingStep: step },
      { new: true }
    );
  }

  static async getBooking(bookingId) {
    return await Booking.findById(bookingId);
  }

  static async completeBooking(bookingId) {
    return await Booking.findByIdAndUpdate(
      bookingId,
      { onboardingStep: "completed" },
      { new: true }
    );
  }
}

module.exports = BookingService;
