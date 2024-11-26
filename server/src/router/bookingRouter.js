import express from "express";

import bookingCtrl from "../controllers/bookingCtrl.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

router.get("/booking", auth, bookingCtrl.getUserBooking);

router.get("/booking/:id", auth, bookingCtrl.getBooking);

router.get("/bookings", authAdmin, bookingCtrl.getBookings);

router.put("/booking", authAdmin, bookingCtrl.updateBooking);

router.post("/razorpay", auth, bookingCtrl.getRazorpay);

router.post("/verification", auth, bookingCtrl.verification);

export default router;
