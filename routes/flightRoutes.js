import express from "express";
import {
    createFlight,
    getAllFlights,
    updateFlight,
    deleteFlight,
    toggleFlightStatus,
    getFlight,
} from "../controllers/flightController.js";

const router = express.Router();

router.route("/admin/flights").get(getAllFlights).post(createFlight);
router.route("/admin/flights/:id").get(getFlight).put(updateFlight).delete(deleteFlight);
router.put("/admin/flights/:id/toggle", toggleFlightStatus);

export default router;