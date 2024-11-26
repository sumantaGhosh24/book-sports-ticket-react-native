import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Sport",
    },
    paymentResult: {
      id: {type: String},
      status: {type: String},
      razorpay_order_id: {type: String},
      razorpay_payment_id: {type: String},
      razorpay_signature: {type: String},
    },
    orderStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refund"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {timestamps: true}
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
