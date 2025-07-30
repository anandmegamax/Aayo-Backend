import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema({
    menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
    action: String, // e.g., 'view', 'edit'
    name: { type: String, unique: true },
});
export default mongoose.model("Permission", PermissionSchema);