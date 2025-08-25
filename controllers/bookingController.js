import Booking from "../models/booking.js";

//import APIFilters from "../utils/apiFilters.js";

import APIFeatures from "../utils/APIFeatures.js";


export const addBooking = async (req, res) => {
    try {
        const booking = await Booking.create(req.body);
        res.status(201).json({ success: true, message: "Booking Added Successfully", booking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("user").populate("flightType", "name");

        res.json({ bookings });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export const getBookingById = async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate('user');
    if (!booking) return res.status(404).json({ message: 'Not found' });
    res.json(booking);
};

export const updateBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true }).populate('user');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);

};

//deleteBooking is not implemented in the original code, so we won't implement it here.
export const deleteBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
};


export const updateBookingPayment = async (req, res) => {
    const { id } = req.params;
    const { amount, transactionDate, transactionNo, remarks, method } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.payments.push({ amount, transactionDate, transactionNo, remarks, method });
    const totalPaid = booking.payments.reduce((acc, p) => acc + p.amount, 0);
    const balance = booking.totalAmount - totalPaid;

    await booking.save();

    res.json({ message: 'Payment added', balance });
};
