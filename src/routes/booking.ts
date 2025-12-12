import { Router, Request, Response } from "express";
import { IBooking } from "../utils/types";
import Booking from "../models/bookings";
import { formatDateString } from "../utils/time";
import { validate } from "../utils/ValidateMiddleware";
import { z } from "zod";
import Plan from "../models/plan";

const bookingSchema = z.object({
  name: z.string().max(50, "Name cannot be longer than 50 characters"),
  email: z.email(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((d) => new Date(d) > new Date(), {
      message: "Date must be in the future",
    }),
  type_of_booking: z.string().optional(),
});

const bookingRouter = Router();

bookingRouter.post(
  "/",
  validate(bookingSchema),
  async (req: Request, res: Response) => {
    try {
      const input: IBooking = {
        name: req.body.name,
        email: req.body.email,
        date: req.body.date,
        type_of_booking: req.body.type_of_booking,
        activated: false,
      };
      const { name, email, date, type_of_booking } = input;
      if (!name || !email || !date || !type_of_booking) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }

      const dateString = formatDateString(date);

      const existingBookings = await Booking.find({ date: dateString });
      const availableSlots = 50 - existingBookings.length;
      if (availableSlots <= 0) {
        return res
          .status(401)
          .json({ success: false, error: "the hub is fully booked" });
      }

      const existingPlan = await Plan.findOne({ email });
      if (existingPlan) {
        await Plan.findByIdAndUpdate(
          existingPlan._id,
          { sessions: existingPlan.sessions - 1 },
          { new: true }
        );
      }

      const booking = await Booking.create(input);

      if (!booking) {
        return res.status(500).json({
          success: false,
          error: "something went wrong while creating your booking",
        });
      }

      return res.status(201).json({ success: true, data: booking });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "something went wrong" });
    }
  }
);

bookingRouter.get(
  "/today",
  validate(bookingSchema),
  async (req: Request, res: Response) => {
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
  }
);

bookingRouter.post("/plan", async (req: Request, res: Response) => {
  try {
    const { email, plan } = req.body;
    let sessions = 1;

    if (plan === "weekly") {
      sessions = 7;
    } else if (plan === "monthly") {
      sessions = 30;
    }

    const existingPlan = await Plan.findOne({ email });

    if (existingPlan) {
      const newSessions = existingPlan.sessions + sessions;
      const update = await Plan.findByIdAndUpdate(
        existingPlan._id,
        { sessions: newSessions },
        { new: true }
      );
      return res.status(200).json({ success: true, data: update });
    }

    const newPlan = await Plan.create({ email, sessions });
    if (!newPlan) {
      return res.status(400).json({
        success: false,
        error: "something went wrong while creating your plan",
      });
    }

    return res.status(201).json({ success: true, data: newPlan });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "something went wrong",
    });
  }
});
export default bookingRouter;
