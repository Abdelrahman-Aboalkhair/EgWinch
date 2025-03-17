const Booking = require("./booking.model");
const Notification = require("../notifications/notification.model");
const redis = require("../../lib/redis");

class BookingService {
  static async getUserBookings(userId, query) {
    const cacheKey = `bookings:${userId}`;
    let { page = 1, limit = 10 } = query;

    page = parseInt(page);
    limit = parseInt(limit);

    const cachedBookings = await redis.get(cacheKey);
    if (cachedBookings) {
      return { fromCache: true, ...JSON.parse(cachedBookings) };
    }

    const filter = { $or: [{ user: userId }, { driver: userId }] };

    const [totalBookings, bookings] = await Promise.all([
      Booking.countDocuments(filter),
      Booking.find(filter)
        .populate("user driver", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(), // Converts Mongoose docs to plain objects for faster processing
    ]);

    const totalOffers = bookings.reduce(
      (sum, booking) => sum + (booking.offers?.length || 0),
      0
    );

    const response = {
      totalBookings,
      totalOffers,
      currentPage: page,
      totalPages: Math.ceil(totalBookings / limit),
      bookings,
    };

    await redis.setex(cacheKey, 3600, JSON.stringify(response));

    return { fromCache: false, ...response };
  }

  static async getAllBookings(query) {}
  static async createBooking({ userId, pickupLocation, dropoffLocation }) {
    return await Booking.create({
      user: userId,
      pickupLocation,
      dropoffLocation,
    });
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

  static async createOffer(driverId, bookingId, price) {
    if (!price) {
      throw new Error("Price is required");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "pending") {
      throw new Error("Booking is no longer available");
    }

    if (booking.offers.some((offer) => offer.status === "accepted")) {
      throw new Error(
        "An offer has already been accepted, cannot send another"
      );
    }

    const hasActiveOffer = booking.offers.some(
      (offer) =>
        offer.driver.toString() === driverId &&
        ["pending", "negotiating"].includes(offer.status)
    );

    if (hasActiveOffer) {
      throw new Error(
        "You already have an active offer for this booking. Wait for the user's response."
      );
    }

    const offer = { driver: driverId, price, status: "negotiating" };
    booking.offers.push(offer);
    await booking.save();

    await Notification.create({
      user: booking.user,
      message: `New offer from a driver (ID: ${driverId})`,
    });

    await redis.del(`bookings:${booking.user}`);
    await redis.del(`bookings:${driverId}`);

    return offer;
  }

  static async updateBooking(bookingId, userId, role, updateData) {
    const { status, totalPrice, driverId, paymentStatus, action } = updateData;

    let booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (action) {
      if (!["accept", "decline"].includes(action)) {
        throw new Error("Invalid action. Use 'accept' or 'decline'.");
      }

      if (userId.toString() !== booking.user.toString()) {
        throw new Error("Unauthorized: Only the client can update an offer");
      }

      if (
        action === "accept" &&
        booking.offers.some((offer) => offer.status === "accepted")
      ) {
        throw new Error(
          "An offer has already been accepted for this booking, cannot accept another"
        );
      }

      const selectedOffer = booking.offers.find(
        (offer) => offer.driver.toString() === driverId
      );

      if (!selectedOffer) {
        throw new Error("Invalid offer");
      }

      if (action === "accept") {
        selectedOffer.status = "accepted";
        booking.driver = driverId;
        booking.totalPrice = selectedOffer.price;
        booking.paymentStatus = "pending";
        booking.status = "inProgress";

        await Notification.create({
          user: selectedOffer.driver,
          message: `Your offer for booking ${booking._id} was accepted`,
        });
      } else {
        selectedOffer.status = "declined";
        await Notification.create({
          user: selectedOffer.driver,
          message: `Your offer for booking ${booking._id} was rejected`,
        });
      }

      await booking.save();

      await redis.del(`bookings:${booking.user}`);
      await redis.del(`bookings:${booking.driver}`);

      return { message: `Offer ${action}ed successfully`, booking };
    } else {
      if (userId.toString() !== booking.user.toString() && role !== "admin") {
        throw new Error("Unauthorized: You can only update your own bookings");
      }

      booking.status = status || booking.status;
      booking.totalPrice = totalPrice || booking.totalPrice;
      booking.driver = driverId || booking.driver;
      booking.paymentStatus = paymentStatus || booking.paymentStatus;

      await booking.save();

      return { message: "Booking updated successfully", booking };
    }
  }

  static async deleteBooking(bookingId, userId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    await booking.deleteOne();

    // **Invalidate cache**
    await redis.del(`bookings:${booking.user}`);
    await redis.del(`bookings:${booking.driver}`);

    return { message: "Booking deleted successfully" };
  }
}

module.exports = BookingService;
