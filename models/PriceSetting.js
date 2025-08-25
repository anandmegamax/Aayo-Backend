import mongoose from "mongoose";

const priceSettingSchema = new mongoose.Schema({
    headName: { type: String, required: true },
    type: { type: String, enum: ["fixed", "percentage"], required: true },
    amount: { type: Number }, // for fixed
    percentage: { type: Number }, // for percentage
    dependentHeads: [{ type: mongoose.Schema.Types.ObjectId, ref: "PriceSetting" }], // multi-select
});

export default mongoose.model("PriceSetting", priceSettingSchema);