import express from 'express';
import {
    createAirport,
    getAirports,
    updateAirport,
    deleteAirport,
    toggleAirportStatus,
} from '../controllers/airportController.js';
import { upload } from '../middlewares/multer.js';
const router = express.Router();
// Route to create a new airport
router.post('/admin/airports', upload.single('image'), createAirport);

// Route to get all airports
router.get('/admin/airports', getAirports);

// Route to update an airport
router.put('/admin/airports/:id', upload.none(), updateAirport);

// Route to delete an airport
router.delete('/admin/airports/:id', deleteAirport);

// Route to toggle airport status
router.patch('/admin/airports/:id/toggle-status', toggleAirportStatus);

// Route to get a single airport
//router.get('/admin/airports/:id', getAirport);

export default router;