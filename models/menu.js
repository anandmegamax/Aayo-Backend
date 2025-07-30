import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({ name: String, slug: String });

export default mongoose.model("Menu", MenuSchema);