import express from "express";
import {
    createPilot,
    getPilots,
    getPilotById,
    updatePilot,
    deletePilot,
} from "../controllers/pilotController.js";
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// You can wrap with auth/roles if needed
router
    .route("/admin/pilots")
    .get(getPilots)
    .post(isAuthenticatedUser, authorizeRoles("admin"), upload.single("photo"), createPilot);

router
    .route("/admin/pilots/:id")
    .get(isAuthenticatedUser, getPilotById)
    .put(isAuthenticatedUser, authorizeRoles("admin"), upload.single("photo"), updatePilot)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deletePilot);

export default router;
