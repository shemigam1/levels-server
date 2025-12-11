import { NextFunction, Router, Request, Response } from "express";
import User from "../models/user";
import { comparePassword } from "../utils/hash";
import { ResultFunction, signJwt } from "../utils/utils";
import { LoginData } from "../utils/types";
import authMiddleWare from "../utils/authMiddleware";
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

const adminRouter = Router();

adminRouter.post(
    "/activate-booking",
    validate(bookingSchema),
    authMiddleWare,
    async (req, res) => {}
);

adminRouter.post(
    "/deactivate-booking",
    validate(bookingSchema),
    authMiddleWare,
    async (req, res) => {}
);

adminRouter.post("/login", validate(bookingSchema), async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({
            email: email,
        });
        if (user) {
            // console.log(user.password.length);

            const passwordMatch = await comparePassword(
                user.password,
                password
            );
            if (!passwordMatch) {
                const response = ResultFunction(
                    false,
                    "invalid email or password",
                    400,
                    null
                );
                return res.status(response.code).json(response);
            }
            const jwtToken = signJwt(user);
            if (!jwtToken) {
                const response = ResultFunction(
                    false,
                    "unprocessable entity",
                    422,
                    null
                );
                return res.status(response.code).json(response);
            }
            const data: LoginData = {
                token: jwtToken,
                user: {
                    id: user.id,
                    email,
                    name: user.name,
                },
            };
            const response = ResultFunction(
                true,
                "login successful",
                200,
                data
            );
            return res.status(response.code).json(response);
        }
        if (!user) {
            const response = ResultFunction(
                false,
                "invalid email or password",
                400,
                null
            );
            return res.status(response.code).json(response);
        }
    } catch (error) {
        const response = ResultFunction(
            false,
            "something went wrong",
            500,
            null
        );
        return res.status(response.code).json(response);
    }
});

adminRouter.post(
    "/signup",
    validate(bookingSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;

            if (!name || !email || !password) {
                const response = ResultFunction(
                    false,
                    "missing required fields",
                    400,
                    null
                );
                return res.status(response.code).json(response);
            }

            const user = await User.findOne({ email: email });
            if (user) {
                const response = ResultFunction(
                    false,
                    "user exists already",
                    400,
                    null
                );
                return res.status(response.code).json(response);
            }

            try {
                const newUser = (
                    await User.create({ name, email, password })
                ).toObject();
                const { password: _pw, ...other } = newUser;
                const response = ResultFunction(
                    true,
                    "signup successful",
                    201,
                    other
                );
                return res.status(response.code).json(response);
            } catch (error) {
                console.error(error);
                const response = ResultFunction(
                    false,
                    "signup failed",
                    400,
                    null
                );
                return res.status(response.code).json(response);
            }
        } catch (error: any) {
            const response = ResultFunction(
                false,
                "something went wrong",
                500,
                null
            );
            return res.status(response.code).json(response);
        }
    }
);

export default adminRouter;
