import mongoose from "mongoose";

const flightTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    description: { type: String },
    image: {
        public_id: String,
        url: String,
    },
    maxSpeed: { type: Number },
    status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("FlightType", flightTypeSchema);