const Booking = require("../models/booking.model");
const User = require("../models/user.model");
const { getSocketInstance } = require("../libs/socket");
const axios = require("axios");

exports.createBooking = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, date, items, additionalServices } =
      req.body;

    console.log("userId: ", req.user.userId);

    // Validate GeoJSON format for locations
    if (
      !pickupLocation ||
      !pickupLocation.coordinates ||
      !Array.isArray(pickupLocation.coordinates) ||
      pickupLocation.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickupLocation format. It must be a GeoJSON Point.",
      });
    }

    if (
      !dropoffLocation ||
      !dropoffLocation.coordinates ||
      !Array.isArray(dropoffLocation.coordinates) ||
      dropoffLocation.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid dropoffLocation format. It must be a GeoJSON Point.",
      });
    }

    // Create new booking
    const booking = await Booking.create({
      customer: req.user.userId,
      pickupLocation,
      dropoffLocation,
      date,
      items,
      additionalServices,
      status: "pending",
    });

    // Send the booking to nearby drivers
    const nearbyDrivers = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: pickupLocation.coordinates,
          },
          distanceField: "distance",
          maxDistance: 5000,
          spherical: true,
          query: { role: "driver", availabilityStatus: "available" },
        },
      },
    ]);

    console.log("nearbyDrivers: ", nearbyDrivers);

    const io = getSocketInstance();

    if (nearbyDrivers.length > 0) {
      nearbyDrivers.forEach((driver) => {
        io.to(driver._id.toString()).emit("newBookingRequest", { booking });
      });
    }

    res.status(201).json({
      success: true,
      message: "Booking created and sent to nearby drivers",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.predictMovePrice = async (req, res) => {
  const {
    distance_km,
    items_count,
    pickup_floor,
    dropoff_floor,
    fragile_items,
    additional_services,
  } = req.body;

  try {
    // Send request to FastAPI server
    const response = await axios.post(
      "http://localhost:8000/predict_move_price",
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
  } catch (error) {
    console.error("Error predicting move price:", error.message);
    res.status(500).json({ error: "Failed to predict move price" });
  }
};

exports.createOffer = async (req, res) => {
  try {
    const { price } = req.body;
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Check if any of the booking offers is accepted
    if (booking.offers.some((offer) => offer.status === "accepted")) {
      return res.status(400).json({
        success: false,
        message: "An offer has already been accepted, cannot send another",
      });
    }

    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Booking is no longer available" });
    }

    // Add offer to booking
    const offer = { driver: req.user.userId, price, status: "negotiating" };
    booking.offers.push(offer);
    await booking.save();

    const io = getSocketInstance();

    // Notify the client about the new offer
    io.to(booking.customer.toString()).emit("newOffer", {
      message: "You have a new offer",
      offer,
    });

    res.status(200).json({
      success: true,
      message: "Offer sent successfully",
      offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id: bookingId } = req.params;
    const { status, totalPrice, driver, paymentStatus, driverId, action } =
      req.body;
    const io = getSocketInstance();

    let booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (action) {
      if (!["accept", "decline"].includes(action)) {
        return res.status(400).json({
          success: false,
          message: "Invalid action. Use 'accept' or 'decline'.",
        });
      }

      if (req.user.userId.toString() !== booking.customer.toString()) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: Only the client can update an offer",
        });
      }

      if (
        action === "accept" &&
        booking.offers.some((offer) => offer.status === "accepted")
      ) {
        return res.status(400).json({
          success: false,
          message: "An offer has already been accepted, cannot accept another",
        });
      }

      const selectedOffer = booking.offers.find(
        (offer) => offer.driver.toString() === driverId
      );

      if (!selectedOffer) {
        return res.status(400).json({
          success: false,
          message: "Invalid offer",
        });
      }

      if (action === "accept") {
        selectedOffer.status = "accepted";
        booking.driver = driverId;
        booking.totalPrice = selectedOffer.price;
        booking.paymentStatus = "pending";
        booking.status = "in-progress";

        // Notify the driver
        io.to(driverId.toString()).emit("offerAccepted", {
          message: "Your offer was accepted!",
          booking,
        });
      } else {
        selectedOffer.status = "declined";
      }

      await booking.save();

      io.to(driverId.toString()).emit(
        action === "accept" ? "offerAccepted" : "offerDeclined",
        { message: `Your offer was ${action}ed!`, booking }
      );

      return res.status(200).json({
        success: true,
        message: `Offer ${action}ed successfully`,
        booking,
      });
    } else {
      if (
        req.user._id.toString() !== booking.customer.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You can only update your own bookings",
        });
      }

      booking.status = status || booking.status;
      booking.totalPrice = totalPrice || booking.totalPrice;
      booking.driver = driver || booking.driver;
      booking.paymentStatus = paymentStatus || booking.paymentStatus;

      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        booking,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { userId } = req.user;
    let { id, page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let filter = {};

    if (id) {
      filter = { $or: [{ customer: userId }, { driver: userId }] };
    }
    const totalBookings = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate("customer driver", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      totalBookings,
      currentPage: page,
      totalPages: Math.ceil(totalBookings / limit),
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};
exports.getOffers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let filter = {};

    if (userRole === "customer") {
      filter = { customer: userId, offers: { $exists: true, $ne: [] } };
    } else if (userRole === "driver") {
      filter = { "offers.driver": userId };
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Invalid user role",
      });
    }

    const bookings = await Booking.find(filter)
      .populate("driver", "name")
      .exec();

    const formattedBookings = bookings.map((booking) => ({
      ...booking.toObject(),
      offers: booking.offers,
    }));

    res.status(200).json({
      success: true,
      message: "Offers retrieved successfully",
      bookings: formattedBookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id: bookingId } = req.params;
    const { userId } = req.user;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    await booking.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};
