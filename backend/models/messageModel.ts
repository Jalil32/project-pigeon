import mongoose, { Schema } from 'mongoose';

// Message Schema
const messageSchema = new mongoose.Schema({
    sentFrom: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    recipient: {
        required: true,
        type: Schema.Types.ObjectId,
        refPath: 'onModel',
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Groups', 'Users'],
    },
});

const Messages = mongoose.model('Messages', messageSchema);

export = Messages;
