import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  flightNumber: Number,
  booked: Boolean,
  endTime: Date,
});

export default mongoose.model("Booking", BookingSchema);