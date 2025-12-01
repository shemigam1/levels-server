import { Router, Request, Response } from "express";
import { IBooking } from "../utils/types";
import Booking from "../models/bookings";
import { formatDateString, isDateInPast } from "../utils/time";

const bookingRouter = Router();

bookingRouter.post("/", async (req: Request, res: Response) => {
  try {
    const input: IBooking = {
      name: req.body.name,
      email: req.body.email,
      date: req.body.date,
      type_of_booking: req.body.type_of_booking,
      //   is_active: false,
    };
    const { name, email, date, type_of_booking } = input;
    if (!name || !email || !date || !type_of_booking) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }
    if (isDateInPast(date)) {
      return res
        .status(400)
        .json({ success: false, error: "date cannot be in the past" });
    }

    const dateString = formatDateString(date);

    const existingBookings = await Booking.find({ date: dateString });
    const availableSlots = 50 - existingBookings.length;
    if (availableSlots <= 0) {
      return res
        .status(401)
        .json({ success: false, error: "the hub is fully booked" });
    }

    const booking = await Booking.create(input);

    if (!booking) {
      return res
        .status(500)
        .json({ success: false, error: "something went wrong" });
    }

    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "something went wrong" });
  }
});

bookingRouter.get("/today", async (req: Request, res: Response) => {
  try {
    // const date = req.body.date;
    const date = formatDateString(new Date().toISOString());
    console.log(date);

    const bookings = await Booking.find({ date: date });

    if (!bookings) {
      return res
        .status(500)
        .json({ success: false, error: "something went wrong" });
    }

    if (bookings.length >= 50) {
      return res
        .status(400)
        .json({ success: false, error: "the hub is fully booked" });
    }
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "something went wrong" });
  }
});

export default bookingRouter;
