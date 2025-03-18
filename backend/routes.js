import express from "express";
import Booking from "./models/Booking.js";

const router = express.Router();

// Hent status på alle fly
router.get("/flights", async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

// Reserver et fly
router.post("/book", async (req, res) => {
  const { flightNumber } = req.body;
  await Booking.create({ flightNumber, booked: true, endTime: Date.now() + 30 * 60 * 1000 });
  res.json({ message: "Fly reservert" });
});

// Frigi et fly
router.post("/release", async (req, res) => {
  const { flightNumber } = req.body;
  await Booking.deleteOne({ flightNumber });
  res.json({ message: "Fly frigjort" });
});

export default router;