import FlightType from "../models/flightType.js";
import { upload_file, delete_file } from "../utils/cloudinary.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";


export const createFlightType = catchAsyncErrors(async (req, res, next) => {
    const { name, capacity, description, maxSpeed, status } = req.body;

    let imageData = {};
    if (req.file?.path) {
        imageData = await upload_file(req.file.path, "Aayo/flight_types");
    }

    const flightType = await FlightType.create({
        name,
        capacity,
        description,
        maxSpeed,
        status,
        image: imageData,
    });

    res.status(201).json({ success: true, flightType });
});

export const getFlightTypes = async (req, res) => {
    const flightTypes = await FlightType.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, flightTypes });
};

// Update Flight Type
export const updateFlightType = async (req, res) => {
    const { name, capacity, description, maxSpeed, status } = req.body;

    const flightType = await FlightType.findById(req.params.id);
    if (!flightType) {
        return res
            .status(404)
            .json({ success: false, message: "Flight Type not found" });
    }

    // Upload new image if file exists
    try {
        if (req.file) {
            if (flightType.image?.public_id) {
                await delete_file(flightType.image.public_id);
            }

            const result = await upload_file(req.file.path, "FlightTypes");
            flightType.image = {
                public_id: result.public_id,
                url: result.url,
            };
        }
    } catch (err) {
        console.error("Cloudinary Upload Failed:", err);
        return res.status(500).json({ success: false, message: "Image upload failed" });
    }

    // Update other fields
    flightType.name = name;
    flightType.capacity = capacity;
    flightType.description = description;
    flightType.maxSpeed = maxSpeed;
    flightType.status = status === "true" || status === true; // handle checkbox

    await flightType.save();

    res.status(200).json({ success: true, flightType });
};

// Delete Flight Type
export const deleteFlightType = async (req, res) => {
    const flightType = await FlightType.findById(req.params.id);

    if (!flightType) {
        return res.status(404).json({ success: false, message: "Flight Type not found" });
    }

    await flightType.remove();
    res.status(200).json({ success: true, message: "Flight Type deleted" });
};

