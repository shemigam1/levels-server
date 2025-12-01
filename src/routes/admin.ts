import { Router } from "express";

const adminRouter = Router();

adminRouter.post("/activate-booking");
adminRouter.post("/deactivate-booking");

adminRouter.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
});
