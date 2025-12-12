import mongoose, { Schema } from "mongoose";
import { IBooking } from "../utils/types";

const BookingSchema: Schema = new Schema<IBooking>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    date: { type: String, required: true, trim: true },
    type_of_booking: { type: String, required: true, trim: true },
    // sessions: { type: Number, default: 1 },
    activated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ date: 1 });
// BookingSchema.index({ weekly: 1 });
// BookingSchema.index({ month: 1 });

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
