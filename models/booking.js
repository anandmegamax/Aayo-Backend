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
    flightType: String,
    remarks: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    totalAmount: Number,
    payments: [paymentSchema]
});

export default mongoose.model('Booking', bookingSchema);
