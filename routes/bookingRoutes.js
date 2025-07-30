import express from 'express';
import { addBooking, getBookings, getBookingById, updateBookingPayment, updateBooking, deleteBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/admin/bookings', addBooking);
router.get('/admin/bookings', getBookings);
router.get('/admin/bookings/:id', getBookingById);
router.put('/admin/bookings/:id/payments', updateBookingPayment);
router.post('/admin/bookings/add', addBooking);
router.put('/admin/bookings/:id', updateBooking);
router.delete('/admin/bookings/:id', deleteBooking);

export default router;
