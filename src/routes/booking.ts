import { Router, Request, Response } from "express";
import { IBooking } from "../utils/types";
import Booking from "../models/bookings";

const bookingRouter = Router();

bookingRouter.post("/", async (req: Request, res: Response) => {
  try {
    const input: IBooking = {
      name: req.body.name,
      email: req.body.email,
      date: req.body.date,
      type_of_booking: req.body.type_of_booking,
      is_active: false,
    };

    const existingBookings = await Booking.find({ date: input.date });
    if (existingBookings.length >= 50) {
      return res
        .status(400)
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

bookingRouter.get("/", async (req: Request, res: Response) => {
  try {
    const date = req.body.date;
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
