import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

export const Session = mongoose.model('Session', sessionSchema);
