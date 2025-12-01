// import express, { Request, Response } from "express";
import express, { Request, Response, NextFunction } from "express";
import { config } from "./utils/config";
import { paymentRouter } from "./routes/paystack";
import conn from "./utils/conn";
import Booking from "./models/bookings";
import cors from "cors";
import { IBooking } from "./utils/types";
// todos
// 1. add validation to booking input
// 2. add "is_active" field to booking model
// 3. add pagination to get bookings endpoint
// 4. add logic and route to end session / deactivate booking
const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post(
  "/booking",
  async (req: Request, res: Response, next: NextFunction) => {
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
        .status(500)
        .json({ success: false, error: "the hub is fully booked" });
    }
    const booking = await Booking.create(input);

    if (!booking) {
      return res
        .status(500)
        .json({ success: false, error: "something went wrong" });
    }
    try {
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "something went wrong" });
    }
  }
);

app.post("/", async (req: Request, res: Response) => {
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
        .status(500)
        .json({ success: false, error: "the hub is fully booked" });
    }
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "something went wrong" });
  }
});

app.use("/payments", paymentRouter);
app.use("admin");

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

// Start server
app.listen(config.PORT, async () => {
  await conn;
  console.log(`http://localhost:${config.PORT}`);
});
