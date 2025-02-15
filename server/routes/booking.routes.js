const {
  createBooking,
  updateBooking,
  deleteBooking,
  createOffer,
  getBookings,
  getOffers,
  predictMovePrice,
} = require("../controllers/booking.controller.js");
const { isLoggedIn } = require("../middlewares/auth.middleware.js");

const express = require("express");
const router = express.Router();

router.post("/predict_move_price", predictMovePrice);
router.get("/", isLoggedIn, getBookings);
router.post("/", isLoggedIn, createBooking);
router.get("/offers", isLoggedIn, getOffers);
router.put("/create-offer/:bookingId", isLoggedIn, createOffer);
router.put("/:id", isLoggedIn, updateBooking);
router.delete("/:id", isLoggedIn, deleteBooking);

module.exports = router;
