// controllers/pilotController.js
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Pilot from "../models/pilot.js";
import { upload_file, delete_file } from "../utils/cloudinary.js";

export const createPilot = catchAsyncErrors(async (req, res) => {
    const {
        name,
        email,
        mobile,
        licenseNumber,
        experienceYears,
        baseAirport,
        rating,
        status,
    } = req.body;
    const imageFile = req.file;

    if (!name || !licenseNumber) {
        return res.status(400).json({ success: false, message: "Name and License Number are required" });
    }

    let photo = undefined;
    if (imageFile) {
        const upload = await upload_file(imageFile.path);
        if (!upload) {
            return res.status(500).json({ success: false, message: "Image upload failed" });
        }
        photo = { url: upload.url, public_id: upload.public_id };
    }

    const pilot = await Pilot.create({
        name,
        email,
        mobile,
        licenseNumber,
        experienceYears,
        baseAirport,
        rating,
        status,
        photo,
    });

    return res.status(201).json({ success: true, pilot });
});

export const getPilots = catchAsyncErrors(async (req, res) => {
    const pilots = await Pilot.find().populate("baseAirport").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, pilots });
});

export const getPilotById = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const pilot = await Pilot.findById(id).populate("baseAirport");
    if (!pilot) return res.status(404).json({ success: false, message: "Pilot not found" });
    return res.status(200).json({ success: true, pilot });
});

export const updatePilot = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const {
        name,
        email,
        mobile,
        licenseNumber,
        experienceYears,
        baseAirport,
        rating,
        status,
    } = req.body;
    const imageFile = req.file;

    const pilot = await Pilot.findById(id);
    if (!pilot) return res.status(404).json({ success: false, message: "Pilot not found" });

    pilot.name = name ?? pilot.name;
    pilot.email = email ?? pilot.email;
    pilot.mobile = mobile ?? pilot.mobile;
    pilot.licenseNumber = licenseNumber ?? pilot.licenseNumber;
    pilot.experienceYears = experienceYears ?? pilot.experienceYears;
    pilot.baseAirport = baseAirport ?? pilot.baseAirport;
    pilot.rating = rating ?? pilot.rating;
    pilot.status = status ?? pilot.status;

    if (imageFile) {
        // delete old if exists
        if (pilot.photo?.public_id) {
            try { await delete_file(pilot.photo.public_id); } catch { }
        }
        const upload = await upload_file(imageFile.path);
        if (!upload) {
            return res.status(500).json({ success: false, message: "Image upload failed" });
        }
        pilot.photo = { url: upload.url, public_id: upload.public_id };
    }

    await pilot.save();
    return res.status(200).json({ success: true, pilot });
});

export const deletePilot = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const pilot = await Pilot.findById(id);
    if (!pilot) return res.status(404).json({ success: false, message: "Pilot not found" });

    if (pilot.photo?.public_id) {
        try { await delete_file(pilot.photo.public_id); } catch { }
    }

    await Pilot.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Pilot deleted successfully" });
});
