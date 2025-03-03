const {
  createBooking,
  updateBooking,
  deleteBooking,
  createOffer,
  getBookings,
  predictMovePrice,
} = require("./booking.controller.js");
const isAuthenticated = require("../../middlewares/isAuthenticated.js");

const express = require("express");
const router = express.Router();

router.post("/predict_move_price", predictMovePrice);
router.get("/", isAuthenticated, getBookings);
router.post("/", isAuthenticated, createBooking);
router.put("/create-offer/:bookingId", isAuthenticated, createOffer);
router.put("/:id", isAuthenticated, updateBooking);
router.delete("/:id", isAuthenticated, deleteBooking);

module.exports = router;
