import mongoose from "mongoose";

const leadRemarkSchema = new mongoose.Schema(
    {
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            required: true,
        },
        remark: {
            type: String,
            required: true,
        },
        addedBy: {
            type: String, // or ref to admin user if needed
            default: "admin",
        },
    },
    { timestamps: true }
);

export default mongoose.model("LeadRemark", leadRemarkSchema);
