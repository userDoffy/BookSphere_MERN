import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
    {
        name: { type: String, required: true, },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: { type: String, default: '' },
        phone: { type: String, default: '' },
        role: { type: String, required: true, default: 'Admin' },
    },
    { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
