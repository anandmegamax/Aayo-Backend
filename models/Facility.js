import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["common", "optional"],
            required: true,
        },
        price: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Facility", facilitySchema);
