import express from "express";

import sportCtrl from "../controllers/sportCtrl.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

router.post("/sport", authAdmin, sportCtrl.createSport);

router
  .route("/sport/:id")
  .get(sportCtrl.getSport)
  .put(authAdmin, sportCtrl.updateSport)
  .delete(authAdmin, sportCtrl.deleteSport);

router.get("/sports", sportCtrl.getSports);

export default router;
