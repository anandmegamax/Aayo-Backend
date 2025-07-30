import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    fromPlace: { type: String, required: true },
    toPlace: { type: String, required: true },
    travelDate: { type: Date, required: true },
    travelTime: { type: String, required: true },
    status: { type: String, enum: ["New", "Discussion", "Closed", "Converted"], default: "New" },
    remarks: [{ message: String, createdAt: { type: Date, default: Date.now } }],
    leadDate: { type: Date, default: Date.now },
    closeDate: { type: Date },
}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);
