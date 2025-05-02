import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true, },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: { type: String, default: '' },
        phone: { type: String, default: '' },
        role: { type: String, required: true, default: 'User' },
        profilepic: { type: String, default: '' },
        Otp: { type: String, default: '' },
        OtpExpireAt: { type: Number, default: 0 },
        isAccountVerified: { type: Boolean, default: false },
        ownedBooks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
