// import express, { Request, Response } from "express";
import express, { Request, Response, NextFunction } from "express";
import { config } from "./utils/config";
import { paymentRouter } from "./routes/paystack";
import conn from "./utils/conn";
import Booking from "./models/bookings";
import cors from "cors";
// import { IBooking } from "./utils/types";
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

/*
Notes 
you can make a daily booking
admins can sign up and log in
{
  "name": "AAdmin User",
  "email": "admin@example.com",
  "password": "AdminPassword123"
}
  {
  "email": "aadmin@example.com",
  "password": "AdminPassword123"
}
  {
    "status": true,
    "message": "Authorization URL created",
    "data": {
        "authorization_url": "https://checkout.paystack.com/dsfzsuavujqe3uy",
        "access_code": "dsfzsuavujqe3uy",
        "reference": "p90tk18gzc"
    }
}
    {
    "status": true,
    "message": "Verification successful",
    "data": {
        "id": 5607308650,
        "domain": "test",
        "status": "abandoned",
        "reference": "p90tk18gzc",
        "receipt_number": null,
        "amount": 1000,
        "message": null,
        "gateway_response": "The transaction was not completed",
        "paid_at": null,
        "created_at": "2025-12-06T00:26:27.000Z",
        "channel": "card",
        "currency": "NGN",
        "ip_address": "102.89.23.122, 172.70.91.31, 172.31.68.120",
        "metadata": "",
        "log": null,
        "fees": null,
        "fees_split": null,
        "authorization": {},
        "customer": {
            "id": 324043262,
            "first_name": null,
            "last_name": null,
            "email": "customer@example.com",
            "customer_code": "CUS_cys6nfw7c3k7c1o",
            "phone": null,
            "metadata": null,
            "risk_action": "default",
            "international_format_phone": null
        },
        "plan": null,
        "split": {},
        "order_id": null,
        "paidAt": null,
        "createdAt": "2025-12-06T00:26:27.000Z",
        "requested_amount": 1000,
        "pos_transaction_data": null,
        "source": null,
        "fees_breakdown": null,
        "connect": null,
        "transaction_date": "2025-12-06T00:26:27.000Z",
        "plan_object": {},
        "subaccount": {}
    }
}

to do:
add validation 
add weekly and monthly options

okay 
that just means making sure the request info is valid names, emails, etc right?
so thats going to be an app wide middlewear right?

so you’ll just validate the inputs to make sure that it’s what we’re expecting
there’s libraries you can use
like Joi, or zod

we are using zod
*/