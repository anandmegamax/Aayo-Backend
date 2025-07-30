// check if the user is authenticated or not
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id).populate('role');
        if (!req.user) {
            return next(new ErrorHandler("User not found", 404));
        }
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token, please login again", 401));
    }
}
);

//Authorize user roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role.name)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource.`, 403));
        }
        next()
    }
}
