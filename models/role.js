import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Role name is required"],
        unique: true,
        trim: true,
        maxlength: [50, "Role name cannot exceed 50 characters"],
        //enum: ['admin', 'vendor', 'user'],
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        //required: [true, "Permissions are required"],
    }]
}, {
    timestamps: true,
});
export default mongoose.model("Role", roleSchema);