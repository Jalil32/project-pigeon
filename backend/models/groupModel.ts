import mongoose, { Schema } from 'mongoose';

// Group Schema
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        requied: true,
        unique: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Messages',
        },
    ],
});

const Groups = mongoose.model('Groups', groupSchema);

export = Groups;
