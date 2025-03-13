const {
  getAllBookings,
  getUserBookings,
  createBooking,
  updateStep,
  completeBooking,
  estimatePrice,
  createOffer,
  updateBooking,
  deleteBooking,
} = require("./booking.controller.js");

const isAuthenticated = require("../../middlewares/isAuthenticated.js");
const authorizeRole = require("../../middlewares/authorizeRole.js");
const express = require("express");
const router = express.Router();

router.get(
  "/all",
  isAuthenticated,
  authorizeRole("admin", "super-admin"),
  getAllBookings
);
router.get("/me", isAuthenticated, authorizeRole("user"), getUserBookings);
router.post("/", isAuthenticated, authorizeRole("user"), createBooking);
router.put(
  "/update-step/:step",
  isAuthenticated,
  authorizeRole("user"),
  updateStep
);
router.put(
  "/complete",
  isAuthenticated,
  authorizeRole("user", "driver"),
  completeBooking
);
router.post("/estimate-price", estimatePrice);
router.put("/create-offer/:bookingId", isAuthenticated, createOffer);
router.put("/:id", isAuthenticated, updateBooking);
router.delete(
  "/:id",
  isAuthenticated,
  authorizeRole("admin", "super-admin"),
  deleteBooking
);

module.exports = router;
