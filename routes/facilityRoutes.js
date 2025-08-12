// routes/facilityRoutes.js

import express from "express";
import {
    createFacility,
    getAllFacilities,
    updateFacility,
    deleteFacility,
} from "../controllers/facilityController.js";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router
    .route("/admin/facilities")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllFacilities)
    .post(isAuthenticatedUser, authorizeRoles("admin"), createFacility);

router
    .route("/admin/facilities/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateFacility)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteFacility);

export default router;
