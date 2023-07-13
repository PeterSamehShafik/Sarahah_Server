import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmEmail: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    age: Number,
    phone: String,
    lastSeen: Date,
    code: { type: String, default: null },
    deleted: { type: Boolean, default: false }
},
    { timestamps: true }
)

export const userModel = mongoose.model('User', userSchema)