import express from "express";
import {
    createFlightType,
    updateFlightType,
    deleteFlightType,
    getFlightTypes,
} from "../controllers/flightTypeController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/admin/flight-types", upload.single("image"), createFlightType);

router.route("/admin/flight-types")
    .get(getFlightTypes);

router.put("/admin/flight-types/:id", upload.single("image"), updateFlightType);

router.route("/admin/flight-types/:id")
    .get(getFlightTypes)
    .delete(deleteFlightType);

export default router;