import mongoose, { Types } from "mongoose";

const messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    reciverId: { type: Types.ObjectId, required: true, ref: 'User' },
    deleted: { type: Boolean, default: false }
},
    { timestamps: true }
)

export const messageModel = mongoose.model('Message', messageSchema)