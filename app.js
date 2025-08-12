import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/dbConnect.js';
import errorMiddleware from './middlewares/errors.js';


// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});

// Load environment variables
dotenv.config({ path: 'backend/config/config.env' });

// Connect to database
connectDatabase();

// Initialize app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Route imports
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import permissionRoutes from './routes/permission.js';
import roleRoutes from './routes/role.js';
import flightRoutes from './routes/flightRoutes.js';
import flightTypeRoutes from './routes/flightTypeRoutes.js';
import airportRoutes from './routes/airportRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import facilityRoutes from './routes/facilityRoutes.js';
import flightCategoryRoutes from './routes/flightCategoryRoutes.js';

// Mount routes
const routes = [
    authRoutes,
    menuRoutes,
    flightCategoryRoutes,
    permissionRoutes,
    roleRoutes,
    flightRoutes,
    flightTypeRoutes,
    airportRoutes,
    bookingRoutes,
    leadRoutes,
    facilityRoutes,
];

routes.forEach((route) => app.use('/api/v1', route));

// Error middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
});
