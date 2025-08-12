import Facility from "../models/Facility.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createFacility = catchAsyncErrors(async (req, res) => {
    const { name, type, price } = req.body;
    const facility = await Facility.create({ name, type, price });
    res.status(201).json(facility);
});

export const getAllFacilities = catchAsyncErrors(async (req, res) => {
    const facilities = await Facility.find().sort({ createdAt: -1 });
    res.json(facilities);
});

export const updateFacility = catchAsyncErrors(async (req, res) => {
    const { name, type, price } = req.body;
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
        return next(new ErrorHandler("Facility not found", 404));
    }
    if (!name || !type || !price) {
        return next(new ErrorHandler("All fields are required", 400));
    }
    if (price < 0) {
        return next(new ErrorHandler("Price cannot be negative", 400));
    }
    await Facility.findByIdAndUpdate(
        req.params.id,
        { name, type, price },
        { new: true }
    );
    res.json(facility);
});

export const deleteFacility = catchAsyncErrors(async (req, res) => {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
        return next(new ErrorHandler("Facility not found", 404));
    }
    await Facility.findByIdAndDelete(req.params.id);
    res.json({ message: "Facility deleted" });
});
