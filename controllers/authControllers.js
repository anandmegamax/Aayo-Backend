import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import Role from "../models/role.js";
import sendToken from "../utils/sendToken.js";
import ErrorHandler from "../utils/errorHandler.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { delete_file, upload_file } from "../utils/cloudinary.js";
import Permission from "../models/permission.js";


// 1. Login User => /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select("+password").populate('role');
    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    // Generate token (assuming you have a method to generate JWT)
    // const token = user.getJwtToken();
    // res.status(200).json({
    //     success: true,
    //     message: "User logged in successfully",
    //     user: {
    //         id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         role: user.role.name, // Assuming role is populated
    //     },
    //     token, // Return the JWT token
    // });

    sendToken(user, res); // Send token in response
});

// 2. Register User => /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    // try {
    const { name, email, phone, password, roleName } = req.body;

    const role = await Role.findOne({ _id: roleName });
    if (!role) return res.status(400).json({ message: 'Invalid role' });

    const user = new User({ name, email, phone, password, role: role._id });
    await user.save();

    const token = user.getJwtToken(); // Generate JWT token
    //res.status(201).json({ user, token: generateToken(user) });
    res.status(201).json({ success: true, message: "User registered successfully", user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: role.name }, token });
    // } catch (err) {
    //     res.status(500).json({ message: err.message });
    // }
});

// 3. Create Role
export const createRole = catchAsyncErrors(async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const role = new Role({ name, permissions });
        await role.save();
        res.status(201).json(role);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. Get All Roles
export const getRoles = catchAsyncErrors(async (req, res) => {
    const roles = await Role.find().populate("permissions");;
    res.json(roles);
});

// 5. Update Role
export const updateRole = catchAsyncErrors(async (req, res) => {
    const { name, permissions } = req.body;
    const role = await Role.findByIdAndUpdate(
        req.params.id,
        { name, permissions },
        { new: true }
    );
    res.json(role);
});

// 6. Delete Role
export const deleteRole = catchAsyncErrors(async (req, res) => {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted' });
});

// 7. Assign Role to User
export const assignRole = catchAsyncErrors(async (req, res) => {
    const { userId, roleId } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role: roleId }, { new: true }).populate('role');
    res.json(user);
});

// Logout User => /api/v1/logout
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        message: "Logged Out",
    })
})

// Upload user avatar => /api/v1/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
    const avatarResponse = await upload_file(req.body.avatar, "Aayo/avatars")

    //Remove previous avatar
    if (req?.user?.avatar?.url) {
        await delete_file(req?.user?.avatar?.public_id)
    }

    const user = await User.findByIdAndUpdate(req?.user?._id, {
        avatar: avatarResponse,
    })
    res.status(200).json({
        user,
    })
})

// Forgot Password => /api/vi/password/forgot

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    //get reset password token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    //Create reset password URL
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name, resetUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "Aayo password recovery",
            message,
        });
        res.status(200).json({
            message: `Email sent to ${user.email}`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(new ErrorHandler(error?.message, 500));
    }
})

// Reset Password  =>  api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    //Hash the URL token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new ErrorHandler("Password reset token is invalid or has been expired", 400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400))
    }
    //Set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    sendToken(user, res)

})

//Get current user profile  =>  /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id).populate({
        path: "role",
        populate: {
            path: "permissions",
        },
    });

    res.status(200).json({
        user,
    })
})

//Update Password  =>  /api/v1/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id).select("+password")

    //check previous user password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400))
    }
    user.password = req.body.password;
    user.save()
    res.status(200).json({
        success: true,
    })
})

//Update User Profile  =>  /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req?.user?._id, newUserData, { new: true })
    res.status(200).json({
        user,
    })
})

//Get All Users = ADMIN =>  /api/v1/admin/users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        users,
    })
})

//Get User Details = ADMIN =>  /api/v1/admin/user/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 4004))
    }

    res.status(200).json({
        user,
    })
})

//Update User Details - Admin  =>  /api/v1/admin/user/:id
export const updateUserDetails = catchAsyncErrors(async (req, res, next) => {
    const { name, email, phone, roleName } = req.body;

    if (!name || !email || !phone || !roleName) {
        return next(new ErrorHandler("Missing required fields", 400));
    }

    const role = await Role.findOne({ _id: roleName });
    if (!role) {
        return next(new ErrorHandler("Invalid role", 400));
    }
    const newUserData = {
        name,
        email,
        phone,
        role: role._id,
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, { new: true })
    res.status(200).json({
        user,
    })
})

//Delete User - Admin  =>  /api/v1/admin/user/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404))
    }
    // TODO - remove user avatar from cloudinary

    await user.deleteOne()
    res.status(200).json({
        success: true,
    })
})

//Get All permissions = ADMIN =>  /api/v1/admin/permissions
export const getAllPermissions = catchAsyncErrors(async (req, res, next) => {
    const permissions = await Permission.find()

    res.status(200).json({
        permissions,
    })
})