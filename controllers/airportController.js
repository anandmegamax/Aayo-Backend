import Airport from "../models/airport.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { upload_file, delete_file } from "../utils/cloudinary.js";

// Create Airport
export const createAirport = async (req, res) => {
    const { name, code, shortName, city, country, coordinates, status } = req.body;

    try {
        const airport = await Airport.create({
            name,
            code,
            shortName,
            city,
            country,
            location: {
                type: "Point",
                coordinates, // [lng, lat]
            },
            status,
        });

        res.status(201).json({ success: true, airport });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all airports
export const getAirports = async (req, res) => {
    try {
        const airports = await Airport.find();
        res.status(200).json({ success: true, airports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update airport
export const updateAirport = async (req, res) => {
    const { name, code, shortName, city, country, status, coordinates } = req.body;

    if (!name || !code || !city || !country || !coordinates) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const airport = await Airport.findById(req.params.id);
    if (!airport) {
        return res.status(404).json({ success: false, message: "Airport not found" });
    }

    airport.name = name;
    airport.code = code;
    airport.shortName = shortName;
    airport.city = city;
    airport.country = country;
    airport.status = status;
    airport.location = {
        type: "Point",
        coordinates, // assuming "lng,lat" string
    };

    await airport.save();

    res.status(200).json({ success: true, airport });
};


// Delete airport
export const deleteAirport = async (req, res) => {
    const { id } = req.params;

    try {
        await Airport.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Airport deleted" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// Toggle airport status
export const toggleAirportStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const airport = await Airport.findById(id);
        if (!airport) {
            return res.status(404).json({ success: false, message: "Airport not found" });
        }

        airport.status = airport.status === "active" ? "inactive" : "active";
        await airport.save();

        res.status(200).json({ success: true, airport });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// Get airport by ID
export const getAirportById = async (req, res) => {
    const { id } = req.params;

    try {
        const airport = await Airport.findById(id);
        if (!airport) {
            return res.status(404).json({ success: false, message: "Airport not found" });
        }
        res.status(200).json({ success: true, airport });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

