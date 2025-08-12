import express from 'express';
import {
    createFlightCategory,
    updateFlightCategory,
    deleteFlightCategory,
    getFlightCategories,
} from '../controllers/flightCategoryController.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/admin/flight-category', upload.single('image'), createFlightCategory);
router.put('/admin/flight-category/:id', upload.single('image'), updateFlightCategory);
router.delete('/admin/flight-category/:id', deleteFlightCategory);
router.get('/admin/flight-category', getFlightCategories);

export default router;
