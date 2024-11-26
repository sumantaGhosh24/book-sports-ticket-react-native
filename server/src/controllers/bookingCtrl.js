import dotenv from "dotenv";
import crypto from "crypto";
import Razorpay from "razorpay";

import Booking from "../models/bookingModel.js";
import {APIFeatures} from "../lib/index.js";

dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const bookingCtrl = {
  getUserBooking: async (req, res) => {
    try {
      const features = new APIFeatures(
        Booking.find({buyer: req.user._id})
          .populate("buyer", "_id username email image")
          .populate("sport", "_id title description image"),
        req.query
      )
        .paginating()
        .sorting();

      const features2 = new APIFeatures(
        Booking.find({buyer: req.user._id}),
        req.query
      );

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const bookings = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      return res.json({bookings, count, success: true});
    } catch (error) {
      return res.json({msg: error.message, success: false});
    }
  },
  getBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate("buyer", "_id username email image")
        .populate("sport", "_id title description image");

      return res.json({booking, success: true});
    } catch (error) {
      return res.json({msg: error.message, success: false});
    }
  },
  getBookings: async (req, res) => {
    try {
      const features = new APIFeatures(
        Booking.find()
          .populate("buyer", "_id username email image")
          .populate("sport", "_id title description image"),
        req.query
      )
        .paginating()
        .sorting();

      const features2 = new APIFeatures(Booking.find(), req.query);

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const bookings = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      return res.json({bookings, count, success: true});
    } catch (error) {
      return res.json({msg: error.message, success: false});
    }
  },
  updateBooking: async (req, res) => {
    try {
      const {orderStatus, id} = req.body;

      const booking = await Booking.findByIdAndUpdate(
        id,
        {orderStatus},
        {new: true}
      );
      if (!booking)
        return res.json({
          message: "This booking does not exists.",
          success: false,
        });

      return res.json({message: "Booking updated successful.", success: true});
    } catch (error) {
      return res.json({msg: error.message, success: false});
    }
  },
  getRazorpay: async (req, res) => {
    try {
      const options = {
        amount: Number(req.body.price * 100),
        currency: "INR",
      };
      const order = await instance.orders.create(options);
      if (!order) return res.json({message: "server error", success: false});

      return res.json({order, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  verification: async (req, res) => {
    try {
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        sport,
        price,
      } = req.body;
      const buyer = req.user._id;

      const shasum = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      );

      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

      const digest = shasum.digest("hex");

      if (digest !== razorpaySignature)
        return res.json({msg: "Transaction not legit!"});

      const newBooking = new Booking({
        buyer: buyer,
        sport: sport,
        paymentResult: {
          id: orderCreationId,
          status: "success",
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        },
        orderStatus: "pending",
        price: price,
      });
      await newBooking.save();

      res.json({
        msg: "success",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        success: true,
      });
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
};

export default bookingCtrl;
