import express from "express";
import {
    getLeads,
    closeLead,
    getLeadById,
    createLead,
    getLeadRemarks,
    addLeadRemark,
    convertLeadToBooking,
    updateLead,
} from "../controllers/leadController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/admin/leads", createLead);
router.get("/admin/leads", isAuthenticatedUser, getLeads);
router.get("/admin/leads/:id", isAuthenticatedUser, getLeadById);
router.get("/admin/lead/:id/remarks", getLeadRemarks);
router.post("/admin/lead/:id/remarks", addLeadRemark);
router.put("/admin/leads/:id/close", isAuthenticatedUser, closeLead);
router.post("/admin/leads/:id/convert", isAuthenticatedUser, convertLeadToBooking);
router.put("/admin/leads/:id", isAuthenticatedUser, updateLead);

export default router;
