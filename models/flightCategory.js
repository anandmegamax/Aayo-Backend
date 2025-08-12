import mongoose from "mongoose";

const flightCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    status: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const FlightCategory = mongoose.model("FlightCategory", flightCategorySchema);

export default FlightCategory;
