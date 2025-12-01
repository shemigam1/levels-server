import mongoose, { Schema } from "mongoose";
import { IBooking } from "../utils/types";

const BookingSchema: Schema = new Schema<IBooking>(
  {
    name: { type: String, required: true, index: true, trim: true },
    email: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    date: { type: String, required: true, trim: true },
    type_of_booking: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
