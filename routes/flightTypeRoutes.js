import express from "express";
import {
    createFlightType,
    updateFlightType,
    deleteFlightType,
    getFlightTypes,
} from "../controllers/flightTypeController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// router.post("/admin/flight-types", upload.array("images", 10), (req, res, next) => {
//     console.log("Files received at route:", req.files.length);
//     next();
// }, createFlightType);

router.post("/admin/flight-types", upload.array("images", 10), createFlightType);

router.route("/admin/flight-types")
    .get(getFlightTypes);

router.put("/admin/flight-types/:id", upload.array("images", 10), updateFlightType);

router.route("/admin/flight-types/:id")
    .get(getFlightTypes)
    .delete(deleteFlightType);

export default router;