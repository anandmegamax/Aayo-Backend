import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import FlightCategory from "../models/flightCategory.js";
import { upload_file, delete_file } from "../utils/cloudinary.js";
import fs from "fs";

export const createFlightCategory = catchAsyncErrors(async (req, res) => {
    const { name, description } = req.body;
    const imageFile = req.file; // multer single file

    if (!name || !description || !imageFile) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // IMPORTANT: pass the file path (string), not the whole object.
    const imageUploadResult = await upload_file(imageFile.path, "Aayo/flight_categories");
    if (!imageUploadResult) {
        return res.status(500).json({ success: false, message: "Image upload failed" });
    }

    // remove temp file
    try {
        fs.unlinkSync(imageFile.path);
    } catch (err) {
        console.warn("Failed to unlink temp file:", err);
    }

    const flightCategory = new FlightCategory({
        name,
        description,
        image: {
            url: imageUploadResult.url,
            public_id: imageUploadResult.public_id,
        },
    });

    await flightCategory.save();

    return res.status(201).json({ success: true, flightCategory });
});

export const getFlightCategories = catchAsyncErrors(async (req, res) => {
    const flightCategories = await FlightCategory.find().sort({ createdAt: -1 });

    return res.status(200).json({ success: true, flightCategories });
});

export const updateFlightCategory = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const imageFile = req.file;

    const flightCategory = await FlightCategory.findById(id);
    if (!flightCategory) {
        return res.status(404).json({ success: false, message: "Flight Category not found" });
    }

    flightCategory.name = name;
    flightCategory.description = description;

    if (imageFile) {
        // delete old image from Cloudinary (if exists)
        if (flightCategory.image?.public_id) {
            try {
                await delete_file(flightCategory.image.public_id);
            } catch (err) {
                console.warn("Failed to delete previous image from Cloudinary:", err);
            }
        }

        // upload new image (pass file path)
        const imageUploadResult = await upload_file(imageFile.path, "Aayo/flight_categories");
        if (!imageUploadResult) {
            return res.status(500).json({ success: false, message: "Image upload failed" });
        }

        // remove temp file
        try {
            fs.unlinkSync(imageFile.path);
        } catch (err) {
            console.warn("Failed to unlink temp file:", err);
        }

        flightCategory.image = {
            url: imageUploadResult.url,
            public_id: imageUploadResult.public_id,
        };
    }

    await flightCategory.save();

    return res.status(200).json({ success: true, flightCategory });
});

export const deleteFlightCategory = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;

    const flightCategory = await FlightCategory.findById(id);
    if (!flightCategory) {
        return res.status(404).json({ success: false, message: "Flight Category not found" });
    }

    // Delete image from Cloudinary
    if (flightCategory.image?.public_id) {
        await delete_file(flightCategory.image.public_id);
    }

    // Delete the document
    await FlightCategory.deleteOne({ _id: id });
    // or: await flightCategory.deleteOne();

    return res.status(200).json({ success: true, message: "Flight Category deleted successfully" });
});


export const getFlightCategoryById = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;

    const flightCategory = await FlightCategory.findById(id);
    if (!flightCategory) {
        return res.status(404).json({ success: false, message: "Flight Category not found" });
    }
    return res.status(200).json({ success: true, flightCategory });
});
