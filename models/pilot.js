import mongoose from "mongoose";

const PilotSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, trim: true },
        mobile: { type: String, trim: true },
        licenseNumber: { type: String, required: true, unique: true, trim: true },
        experienceYears: { type: Number, default: 0 },
        baseAirport: { type: mongoose.Schema.Types.ObjectId, ref: "Airport" }, // optional relation
        rating: { type: Number, min: 0, max: 5, default: 0 },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        photo: {
            url: String,
            public_id: String,
        },
    },
    { timestamps: true }
);

const Pilot = mongoose.model("Pilot", PilotSchema);
export default Pilot;
