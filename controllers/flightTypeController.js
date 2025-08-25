import FlightType from "../models/flightType.js";
import { upload_file, delete_file } from "../utils/cloudinary.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import fs from "fs";



export const createFlightType = catchAsyncErrors(async (req, res, next) => {
    console.log("Files received:", req.files?.length);
    const { name, flightCategory, capacity, description, maxSpeed, status, baggage, baseLocation, pilots, flightAttendant } = req.body;

    const imageUploadPromises = req.files.map((file) =>
        upload_file(file.path, "Aayo/flight_types")
    );

    const uploadedImages = await Promise.all(imageUploadPromises);

    // Optional: remove local temp files after upload
    req.files.forEach(file => fs.unlinkSync(file.path));

    const flightType = await FlightType.create({
        name,
        capacity,
        description,
        maxSpeed,
        status,
        images: uploadedImages, // already in { url, public_id } format
        baggage,
        baseLocation,
        pilots,
        flightAttendant,
        flightCategory
    });

    res.status(201).json({ success: true, flightType });
});


export const getFlightTypes = async (req, res) => {
    const flightTypes = await FlightType.find().populate("flightCategory").populate("baseLocation").sort({ createdAt: -1 });
    res.status(200).json({ success: true, flightTypes });
};

// Update Flight Type

export const updateFlightType = async (req, res) => {
    const { name, flightCategory, capacity, description, maxSpeed, status, baggage, baseLocation, pilots, flightAttendant } = req.body;
    const removedImages = req.body.removedImages || [];

    const flightType = await FlightType.findById(req.params.id);
    if (!flightType) {
        return res.status(404).json({ success: false, message: "Flight Type not found" });
    }

    try {
        // Remove selected images from Cloudinary
        if (Array.isArray(removedImages)) {
            for (const public_id of removedImages) {
                await delete_file(public_id);
                flightType.images = flightType.images.filter(img => img.public_id !== public_id);
            }
        } else if (typeof removedImages === "string") {
            // When only one public_id is passed
            await delete_file(removedImages);
            flightType.images = flightType.images.filter(img => img.public_id !== removedImages);
        }

        // Upload new images
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) =>
                upload_file(file.path, "Aayo/flight_types")
            );
            const uploadedImages = await Promise.all(uploadPromises);

            req.files.forEach((file) => fs.unlinkSync(file.path));

            // Append new images
            flightType.images.push(...uploadedImages.map(img => ({
                public_id: img.public_id,
                url: img.url,
            })));
        }

        // Update other fields
        flightType.name = name;
        flightType.capacity = capacity;
        flightType.description = description;
        flightType.maxSpeed = maxSpeed;
        flightType.status = status;
        flightType.baggage = baggage;
        flightType.baseLocation = baseLocation;
        flightType.pilots = pilots;
        flightType.flightAttendant = flightAttendant === "true" || flightAttendant === true; // handle checkbox
        flightType.flightCategory = flightCategory; // update category

        await flightType.save();

        res.status(200).json({ success: true, flightType });
    } catch (err) {
        console.error("Error updating flight type:", err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};


// export const updateFlightType = async (req, res) => {
//     const { name, capacity, description, maxSpeed, status } = req.body;

//     const flightType = await FlightType.findById(req.params.id);
//     if (!flightType) {
//         return res
//             .status(404)
//             .json({ success: false, message: "Flight Type not found" });
//     }

//     try {
//         // Delete existing images if new ones are uploaded
//         if (req.files && req.files.length > 0) {
//             // Delete existing images from Cloudinary
//             if (flightType.images && flightType.images.length > 0) {
//                 for (const img of flightType.images) {
//                     await delete_file(img.public_id);
//                 }
//             }

//             // Upload new images
//             const imageUploadPromises = req.files.map((file) =>
//                 upload_file(file.path, "Aayo/flight_types")
//             );
//             const uploadedImages = await Promise.all(imageUploadPromises);

//             // Update with new images
//             flightType.images = uploadedImages.map((img) => ({
//                 public_id: img.public_id,
//                 url: img.url,
//             }));
//         }
//     } catch (err) {
//         console.error("Image upload failed:", err);
//         return res
//             .status(500)
//             .json({ success: false, message: "Image upload failed" });
//     }

//     // Update other fields
//     flightType.name = name;
//     flightType.capacity = capacity;
//     flightType.description = description;
//     flightType.maxSpeed = maxSpeed;
//     flightType.status = status;

//     await flightType.save();

//     res.status(200).json({ success: true, flightType });
// };
// export const updateFlightType = async (req, res) => {
//     const { name, capacity, description, maxSpeed, status } = req.body;

//     const flightType = await FlightType.findById(req.params.id);
//     if (!flightType) {
//         return res
//             .status(404)
//             .json({ success: false, message: "Flight Type not found" });
//     }

//     // Upload new image if file exists
//     try {
//         if (req.file) {
//             if (flightType.image?.public_id) {
//                 await delete_file(flightType.image.public_id);
//             }

//             const result = await upload_file(req.file.path, "FlightTypes");
//             flightType.image = {
//                 public_id: result.public_id,
//                 url: result.url,
//             };
//         }
//     } catch (err) {
//         console.error("Cloudinary Upload Failed:", err);
//         return res.status(500).json({ success: false, message: "Image upload failed" });
//     }

//     // Update other fields
//     flightType.name = name;
//     flightType.capacity = capacity;
//     flightType.description = description;
//     flightType.maxSpeed = maxSpeed;
//     flightType.status = status === "true" || status === true; // handle checkbox

//     await flightType.save();

//     res.status(200).json({ success: true, flightType });
// };

// Delete Flight Type
export const deleteFlightType = async (req, res) => {
    const flightType = await FlightType.findById(req.params.id);

    if (!flightType) {
        return res.status(404).json({ success: false, message: "Flight Type not found" });
    }

    await flightType.deleteOne();
    res.status(200).json({ success: true, message: "Flight Type deleted" });
};

