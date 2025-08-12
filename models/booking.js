import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    amount: Number,
    transactionDate: Date,
    transactionNo: String,
    remarks: String,
    method: String
});

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fromPlace: String,
    toPlace: String,
    travelDate: String,
    travelTime: String,
    flightType: { type: mongoose.Schema.Types.ObjectId, ref: 'FlightType', required: true },
    remarks: String,
    bookingType: {
        type: String,
        enum: ["normal", "empty_legs"],
        default: "normal",
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    totalAmount: Number,
    payments: [paymentSchema]
});

export default mongoose.model('Booking', bookingSchema);
