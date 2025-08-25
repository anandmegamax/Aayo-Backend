import express from "express";
import {
    createHead,
    getHeads,
    updateHead,
    deleteHead,
} from "../controllers/priceSettingController.js";

const router = express.Router();

router.post("/admin/price-settings", createHead);
router.get("/admin/price-settings", getHeads);
router.put("/admin/price-settings/:id", updateHead);
router.delete("/admin/price-settings/:id", deleteHead);

export default router;
