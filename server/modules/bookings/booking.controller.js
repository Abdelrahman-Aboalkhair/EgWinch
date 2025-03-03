const Booking = require("./booking.model");
const User = require("../users/user.model");
const axios = require("axios");
const Notification = require("../notifications/notification.model");
const redis = require("../../lib/redis");

exports.createBooking = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, moveDate, items } = req.body;
    console.log("req.body: ", req.body);

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
      user: req.user.userId,
      pickupLocation,
      dropoffLocation,
      moveDate,
      items,
      status: "pending",
    });

    // Invaldiate the cache
    await redis.del(`bookings:${req.user.userId}`);

    // Send the booking to nearby drivers
    const nearbyDrivers = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: pickupLocation.coordinates,
          },
          distanceField: "distance",
          maxDistance: 15000, // 15km
          spherical: true,
          query: {
            role: "driver",
            availabilityStatus: "available",
          },
        },
      },
    ]);

    console.log("found nearby drivers: ", nearbyDrivers);

    // Send notification to nearby drivers
    for (const driver of nearbyDrivers) {
      const notification = new Notification({
        user: driver._id,
        message: `New booking request from ${req.user.name}`,
      });
      await notification.save();
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
  } catch (error) {
    console.error("Error predicting move price:", error.message);
    res.status(500).json({ error: "Failed to predict move price" });
  }
};

exports.createOffer = async (req, res) => {
  try {
    const { price } = req.body;
    const { bookingId } = req.params;
    const driverId = req.user.userId;

    // Validate price input
    if (!price) {
      return res
        .status(400)
        .json({ success: false, message: "Price is required" });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Prevent offers on non-pending bookings
    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Booking is no longer available" });
    }

    // Check if an offer has already been accepted
    if (booking.offers.some((offer) => offer.status === "accepted")) {
      return res.status(400).json({
        success: false,
        message: "An offer has already been accepted, cannot send another",
      });
    }

    // Prevent duplicate active offers from the same driver
    const hasActiveOffer = booking.offers.some(
      (offer) =>
        offer.driver.toString() === driverId &&
        ["pending", "negotiating"].includes(offer.status)
    );

    if (hasActiveOffer) {
      return res.status(400).json({
        success: false,
        message:
          "You already have an active offer for this booking. Wait for the user's response.",
      });
    }

    // Create and add the new offer
    const offer = { driver: driverId, price, status: "negotiating" };
    booking.offers.push(offer);
    await booking.save();

    // Send notification to the user
    await Notification.create({
      user: booking.user,
      message: `New offer from a driver (ID: ${driverId})`,
    });

    // **Invalidate cache for user and driver**
    await redis.del(`bookings:${booking.user}`);
    await redis.del(`bookings:${booking.driver}`);

    res.status(201).json({
      success: true,
      message: "Offer sent successfully",
      offer,
    });
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred",
      error: error.message,
    });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id: bookingId } = req.params;
    const { status, totalPrice, driverId, paymentStatus, action } = req.body;
    console.log("req.body: ", req.body);

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

      if (req.user.userId.toString() !== booking.user.toString()) {
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
      } else {
        selectedOffer.status = "declined";
        const notification = new Notification({
          user: selectedOffer.driver,
          message: `Your offer for booking ${booking._id} was rejected`,
        });
        await notification.save();
      }

      await booking.save();

      // **Invalidate cache for user and driver**
      await redis.del(`bookings:${updatedBooking.user}`);
      await redis.del(`bookings:${updatedBooking.driver}`);

      return res.status(200).json({
        success: true,
        message: `Offer ${action}ed successfully`,
        booking,
      });
    } else {
      if (
        req.user._id.toString() !== booking.user.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You can only update your own bookings",
        });
      }

      booking.status = status || booking.status;
      booking.totalPrice = totalPrice || booking.totalPrice;
      booking.driver = driverId || booking.driver;
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
    const cacheKey = `bookings:${userId}`;
    let { id, page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let filter = {};

    if (id) {
      filter = { $or: [{ user: userId }, { driver: userId }] };
    }

    // **Check if bookings are cached**
    const cachedBookings = await redis.get(cacheKey);
    if (cachedBookings) {
      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully (from cache)",
        ...JSON.parse(cachedBookings),
        fromCache: true,
      });
    }

    // **Fetch from MongoDB if not in cache**
    const totalBookings = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate("user driver", "name")
      .populate("offers.driver", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

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

    // **Store the result in Redis for 1 hour**
    await redis.setex(cacheKey, 3600, JSON.stringify(response));

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      ...response,
      fromCache: false,
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

    // **Invalidate cache for user and driver**
    await redis.del(`bookings:${booking.user}`);
    await redis.del(`bookings:${booking.driver}`);

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
