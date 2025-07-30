import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
    flightType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FlightType",
        required: true,
    },
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, { timestamps: true });

export default mongoose.model("Flight", flightSchema);
