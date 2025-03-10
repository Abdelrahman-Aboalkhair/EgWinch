const express = require("express");
const router = express.Router();
const axios = require("axios");
const asyncHandler = require("../../utils/asyncHandler");

router.get(
  "/geocode/reverse",
  asyncHandler(async (req, res) => {
    const { lat, lon } = req.query;
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent": "egwinch/1.0",
        },
      }
    );
    res.json(response.data);
  })
);

module.exports = router;
