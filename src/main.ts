// import express, { Request, Response } from "express";
import express, { Request, Response, NextFunction } from "express";
import { config } from "./utils/config";
import { paymentRouter } from "./routes/paystack";
import conn from "./utils/conn";
import Booking from "./models/bookings";
import cors from "cors";
import { IBooking } from "./utils/types";
import adminRouter from "./routes/admin";
import bookingRouter from "./routes/booking";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/", bookingRouter);

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
