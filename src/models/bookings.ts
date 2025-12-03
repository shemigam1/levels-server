import mongoose, { Schema } from "mongoose";
import { IBooking } from "../utils/types";

const BookingSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    date: { type: String, required: true, trim: true },
    //type_of_booking: { type: String, required: true, trim: true }, // Only for day bookings
    // WEEKLY booking (YYYY-WW)  ← NEW
    week: { type: String, trim: true },
    month: { type: String, trim: true },     // Only for month bookings
    booking_scope: {                          // NEW
      type: String,
      required: true,
      enum: ["day", "month", "weekly"],
      //default: "daily",
      index: true,
    },
    // Subscription chosen
    plan: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "monthly"],   // ← NEW
    },
    slots: { type: Number, default: 1 }       // NEW
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ date: 1 });
BookingSchema.index({ weekly: 1 });
BookingSchema.index({ month: 1 });

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
