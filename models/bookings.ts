import mongoose, { Schema } from "mongoose";

export interface IBooking {
  name: string;
  email: string;
  start_time: string;
  end_time: string;
  date: string;
  type_of_booking: string;
}

const BookingSchema: Schema = new Schema<IBooking>({
  name: { type: String, required: true, index: true, trim: true },
  email: {
    type: String,
    required: true,
    index: true,
    trim: true,
    lowercase: true,
  },
  start_time: { type: String, required: true, trim: true },
  end_time: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  type_of_booking: { type: String, required: true, trim: true },
});

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
