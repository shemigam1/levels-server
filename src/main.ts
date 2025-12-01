// import express, { Request, Response } from "express";
import express, { Request, Response, NextFunction } from "express";
import { config } from "./utils/config";
import { paymentRouter } from "./routes/paystack";
import conn from "./utils/conn";
import Booking from "./models/bookings";
import cors from "cors";
import { IBooking } from "./utils/types";
import adminRouter from "./routes/admin";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post(
  "/booking",
  async (req: Request, res: Response, next: NextFunction) => {
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

app.use("/payments", paymentRouter);
app.use("/admin", adminRouter); //

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

// Start server
app.listen(config.PORT, async () => {
  await conn;
  console.log(`http://localhost:${config.PORT}`);
});
