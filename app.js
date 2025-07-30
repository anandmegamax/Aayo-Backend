import express from 'express';
const app = express();
import dotenv from 'dotenv';
import { connectDatabase } from './config/dbConnect.js';
import errorMiddleware from './middlewares/errors.js';
import cookieParser from 'cookie-parser';

//handling uncaught exceptions
// process.on("uncaughtException", (err) => {
//     console.log(`Error: ${err}`);
//     console.log("Shutting down the server due to uncaught exception");
//     process.exit(1);
// });

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection: ", err.message);
    console.error("Full error:", err); // 👈 log full object
    process.exit(1);
});

dotenv.config({ path: "backend/config/config.env" });

//connecting to database
connectDatabase();

app.use(express.json({ limit: '10mb' })); //for parsing application/json
app.use(cookieParser()); //for parsing cookies

//Import all routes
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import permissionRoutes from './routes/permission.js';
import roleRoutes from './routes/role.js';
import flightRoutes from './routes/flightRoutes.js'
import flightTypeRoutes from './routes/flightTypeRoutes.js';
import airportRoutes from './routes/airportRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

app.use('/api/v1', authRoutes);
app.use('/api/v1', menuRoutes);
app.use('/api/v1', permissionRoutes);
app.use('/api/v1', roleRoutes);
app.use('/api/v1', bookingRoutes);
app.use('/api/v1', flightRoutes);
app.use('/api/v1', flightTypeRoutes);
app.use('/api/v1', airportRoutes);
app.use('/api/v1', leadRoutes);


//using error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
}
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err}`);
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    });
});