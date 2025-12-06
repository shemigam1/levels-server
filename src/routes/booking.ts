import { Router, Request, Response } from "express";
// import { IBooking } from "../utils/types";
import Booking from "../models/bookings";
import { formatDateString } from "../utils/time";
// import { error } from "console";
//import { getPlanDetails } from "../utils/plan";
import { validate } from "../utils/ValidateMiddleware";
import { z } from "zod";


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

//Daily Booking only
//take in, name email, date, booking_type and store in our database
bookingRouter.post("/", validate(bookingSchema), async (req: Request, res: Response) => {
    // const booking_plan = req.body.booking_plan || "daily";
    // if (!booking_plan) {
    //     return res
    //         .status(400)
    //         .json({ success: false, error: "booking_plan is required" });
    // }

    try {
        // const planDetails = getPlanDetails(booking_plan);
        // const planSlots = planDetails.slots;
        const { name, email, date, type_of_booking } = req.body;
        // const input: IBooking = {
        //     name: req.body.name,
        //     email: req.body.email,
        //     date: req.body.date,
        //     type_of_booking: req.body.type_of_booking || "Any Meetig Room"
        //     booking_type: req.body.booking_type || "Daily",
        //     slots: req.body.slots,
        //     is_active: false,
        // };
        // const { name, email, date, type_of_booking } = input;
        if (!name || !email || !date) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
            });
        }
        // if (isDateInPast(date)) {
        //     return res
        //         .status(400)
        //         .json({ success: false, error: "date cannot be in the past" });
        // }

        const dateString = formatDateString(date);
        const final_type_of_booking = type_of_booking || "Daily";

        const usedSlots = await Booking.countDocuments({ date: dateString });

        // const existing = await Booking.aggregate([
        //     { $match: { date: dateString } },
        //     { $group: { _id: null } },
        // ]);

        // const usedSlots = existing.length ? existing.length : 0;
        const totalCapacity = 50;
        if (usedSlots > totalCapacity) {
            return res.status(400).json({
                success: false,
                error: "Not enough slots left for this day",
            });
        }
        
        const newBooking = await Booking.create({
            name,
            email,
            date: dateString,
            type_of_booking : final_type_of_booking,
            // booking_scope: booking_plan,
            // slots: 1,
        });
        if (!newBooking) {
            return res
            .status(500)
            .json({ success: false, error: "something went wrong" });
        }
        
        return res.status(201).json({ success: true, data: newBooking });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                error: error instanceof Error ? error.message : error,
            });
    }
});

export default bookingRouter;

/** 
bookingRouter.get("/today", async (req: Request, res: Response) => {
    try {
        // const date = req.body.date;
        const date = formatDateString(new Date().toISOString());
        console.log(date);

        const bookings = await Booking.find({ date: date });

        if (!bookings) {
            return res
                .status(500)
                .json({ success: false, error: "something went wrong3" });
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
            .json({ success: false, error: "something went wrong4" });
    }
});
//*/

/** 
bookingRouter.post("/weekly", async (req: Request, res: Response) => {
    try {
        const input: IBooking = {
            name: req.body.name,
            email: req.body.email,
            date: req.body.date, // Starting date of the week
            booking_type: req.body.booking_type,
            type_of_booking: req.body.type_of_booking,
            slots: req.body.slots,
        };

        const { name, email, date, type_of_booking, slots } = input;

        // Required field checks
        if (!name || !email || !date || !type_of_booking) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
            });
        }

        // Prevent booking past dates
        if (isDateInPast(date)) {
            return res
                .status(400)
                .json({ success: false, error: "date cannot be in the past" });
        }

        // Normalize the date string
        const dateString = formatDateString(date);

        // How many slots already used for the week?
        const existing = await Booking.aggregate([
            { $match: { date: dateString, booking_scope: "weekly" } },
            { $group: { _id: null, usedSlots: { $sum: "$slots" } } },
        ]);

        const usedSlots = existing.length ? existing[0].usedSlots : 0;
        const totalCapacity = 200; // your weekly capacity here

        // Not enough slots?
        if (usedSlots + slots > totalCapacity) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: "Not enough slots left for this week",
                });
        }

        // Create the booking
        const newBooking = await Booking.create({
            name,
            email,
            date: dateString,
            type_of_booking,
            booking_scope: "weekly",
            slots,
        });

        if (!newBooking) {
            return res
                .status(500)
                .json({ success: false, error: "something went wrong.5" });
        }

        return res.status(201).json({ success: true, data: newBooking });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: "something went wrong.6" });
    }
});


bookingRouter.post("/monthly", async (req: Request, res: Response) => {
    try {
        const input: IBooking = {
            name: req.body.name,
            email: req.body.email,
            month: req.body.month,
            booking_type: req.body.booking_type,
            type_of_booking: req.body.type_of_booking,
            slots: req.body.slots,
        };
        const { name, email, type_of_booking, month, slots } = input;
        if (!name || !email || !type_of_booking || !month) {
            return res
                .status(400)
                .json({ success: false, error: "Missing required fields" });
        }
        if (!/^\d{4}-\d{2}$/.test(month)) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: "month must be in YYYY-MM format",
                });
        }

        //Don't allow bookings for past months
        const [year, mon] = month.split("-").map(Number);
        const monthStart = new Date(year, mon - 1, 1);
        const now = new Date();

        //const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        if (monthStart < new Date(now.getFullYear(), now.getMonth(), 1)) {
            return res
                .status(400)
                .json({ success: false, error: "month cannot be in the past" });
        }

        //if(monthStart < currentMonthStart) {
        //return res.status(400).json({ success: false, error: "month cannot be in the past" });
        //}

        // Aggregate all monthly bookings
        const existing = await Booking.aggregate([
            { $match: { date: month, booking_scope: "monthly" } },
            { $group: { _id: null, usedSlots: { $sum: "$slots" } } },
        ]);

        const usedSlots = existing.length ? existing[0].usedSlots : 0;
        const monthlyCapacity = 200;

        // Check slot availability
        if (usedSlots + slots > monthlyCapacity) {
            return res.status(400).json({
                success: false,
                error: "Not enough monthly slots remaining",
            });
        }

        const booking = await Booking.create({
            name: input.name,
            email: input.email,
            month: input.month,
            booking_type: input.booking_type,
            type_of_booking: input.type_of_booking,
            slots: input.slots,
        });

        if (!booking) {
            return res.status(500).json({
                success: false,
                error: "something went wrong.7",
            });
        }
        return res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: "something went wrong.8" });
    }
});
//*/

//All Daily Bookings
/** 
bookingRouter.get("/", async (req: Request, res: Response) => {
    try {
    const bookings = await Booking.find({ booking_scope: "daily" }).sort({
        date: 1,
    });

        return res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "something went wrong.9",
        });
    }
});
//*/

/** 
bookingRouter.get("/weekly", async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find({
            booking_scope: "weekly",
        }).sort({ week: 1 });

        return res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "something went wrong.10",
        });
    }
});


bookingRouter.get("/monthly", async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find({ booking_scope: "month" });

        res.status(200).json({
            success: true,
            total: bookings.length,
            bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Something went wrong.11",
        });
    }
});
*/
