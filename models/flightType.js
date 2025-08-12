import mongoose from "mongoose";

const flightTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    flightCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FlightCategory",
        required: true
    },
    capacity: { type: Number, required: true },
    description: { type: String },
    images: [
        {
            url: String,
            public_id: String,
        }
    ],
    maxSpeed: { type: Number },
    baggage: { type: String, required: true },
    baseLocation: { type: String, required: true },
    pilots: { type: String, required: true },
    flightAttendant: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("FlightType", flightTypeSchema);