const {
  getBookings,
  createBooking,
  updateStep,
  getBooking,
  completeBooking,
  estimatePrice,
  createOffer,
  updateBooking,
  deleteBooking,
} = require("./booking.controller.js");

const isAuthenticated = require("../../middlewares/isAuthenticated.js");
const express = require("express");
const router = express.Router();

router.get("/", isAuthenticated, getBookings);
router.post("/", isAuthenticated, createBooking);
router.put("/update-step/:step", isAuthenticated, updateStep);
router.get("/:id", isAuthenticated, getBooking);
router.put("/complete", isAuthenticated, completeBooking);
router.post("/estimate-price", estimatePrice);
router.put("/create-offer/:bookingId", isAuthenticated, createOffer);
router.put("/:id", isAuthenticated, updateBooking);
router.delete("/:id", isAuthenticated, deleteBooking);

module.exports = router;
