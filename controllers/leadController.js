import Lead from "../models/Lead.js";
import Booking from "../models/booking.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendBookingEmailWithInvoice } from "../utils/emailUtils.js";

// ✅ Create Lead (only registered user)
export const createLead = catchAsyncErrors(async (req, res, next) => {
    const {
        userId,
        fromPlace,
        toPlace,
        travelDate,
        travelTime,
    } = req.body;

    if (!userId || !fromPlace || !toPlace || !travelDate || !travelTime) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const lead = await Lead.create({
        userId,
        email: user.email,
        phone: user.phone,
        fromPlace,
        toPlace,
        travelDate,
        travelTime,
    });

    res.status(201).json({ success: true, message: "Lead added successfully", lead });
});

// ✅ Get all leads
export const getLeads = async (req, res) => {
    const { keyword, status, fromDate, toDate } = req.query;
    const query = {};

    if (keyword) {
        query.$or = [
            { email: { $regex: keyword, $options: "i" } },
            { phone: { $regex: keyword, $options: "i" } },
        ];
    }

    if (status) query.status = status;
    if (fromDate && toDate) {
        query.leadDate = {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
        };
    }

    const leads = await Lead.find(query).populate("userId", "name email phone");
    res.status(200).json({ leads });
};

// ✅ Get one lead + remarks
export const getLeadById = async (req, res) => {
    const lead = await Lead.findById(req.params.id)
        .populate("userId", "name email phone")
        .populate("remarks.addedBy", "name");
    res.status(200).json({ lead });
};

// ✅ Get remarks of a lead
export const getLeadRemarks = catchAsyncErrors(async (req, res) => {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json({ remarks: lead.remarks.reverse() });
});

// ✅ Add remark
export const addLeadRemark = catchAsyncErrors(async (req, res) => {
    const { remark } = req.body;
    if (!remark) {
        return res.status(400).json({ message: "Please enter update on leads" });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
    }

    lead.remarks.push({
        message: remark,
    });

    await lead.save();
    res.status(200).json({ message: "Remark added successfully" });
});

// ✅ Close lead
export const closeLead = async (req, res) => {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.status = "Closed";
    lead.closeDate = new Date();
    await lead.save();

    res.status(200).json({ success: true, message: "Lead closed successfully" });
};

// ✅ Convert to booking (new schema)
export const convertLeadToBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, travelDate, travelTime, remark, flightType } = req.body;

        const lead = await Lead.findById(id);
        if (!lead) return res.status(404).json({ message: "Lead not found" });

        const user = await User.findById(lead.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const booking = await Booking.create({
            user: user._id,
            fromPlace: lead.fromPlace,
            toPlace: lead.toPlace,
            travelDate,
            travelTime,
            totalAmount: amount,
            flightType,
            remarks: remark,
            status: "pending",
            payments: [],
        });

        lead.status = "Converted";
        lead.closeDate = new Date();
        await lead.save();

        await sendBookingEmailWithInvoice(booking, user); // assumes updated util

        res.status(200).json({ message: "Lead converted to booking", booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
