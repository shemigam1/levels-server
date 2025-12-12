import mongoose, { Schema } from "mongoose";
import { IBooking, IPlan } from "../utils/types";

const PlanSchema: Schema = new Schema<IPlan>(
  {
    email: { type: String, required: true, trim: true },
    sessions: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

PlanSchema.index({ date: 1 });
// PlanSchema.index({ weekly: 1 });
// PlanSchema.index({ month: 1 });

const Plan = mongoose.model<IPlan>("Plan", PlanSchema);
export default Plan;
