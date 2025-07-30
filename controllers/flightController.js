import Flight from "../models/flight.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const getAllFlights = catchAsyncErrors(async (req, res) => {
    const flights = await Flight.find().populate("flightType").sort({ date: -1 });
    res.status(200).json({ success: true, flights });
});

export const createFlight = catchAsyncErrors(async (req, res) => {
    const flight = await Flight.create(req.body);
    res.status(201).json({ success: true, flight });
});

export const getFlight = async (req, res) => {
    const flight = await Flight.findById(req.params.id).populate("flightType");
    res.json({ success: true, flight });
};

export const updateFlight = catchAsyncErrors(async (req, res) => {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, flight });
});

export const deleteFlight = catchAsyncErrors(async (req, res) => {
    await Flight.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Flight deleted" });
});

export const toggleFlightStatus = catchAsyncErrors(async (req, res) => {
    const flight = await Flight.findById(req.params.id);
    flight.status = flight.status === "active" ? "inactive" : "active";
    await flight.save();
    res.status(200).json({ success: true, flight });
});