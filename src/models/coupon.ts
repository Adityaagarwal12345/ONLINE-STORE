import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    coupon: {
      type: String,
      required: [true, "Please enter coupon name"],
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, "Please enter discount amount"],
    },
    code: {
      type: String,
      required: [true, "Please enter coupon code"],
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      required: true,
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.model("Coupon", schema);
