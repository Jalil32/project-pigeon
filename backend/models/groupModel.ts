import mongoose, { Schema } from 'mongoose';
console.log('hello');
// Group Schema
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A group must have a name'],
        unique: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'A group must have a creator'],
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
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const Groups = mongoose.model('Groups', groupSchema);

export = Groups;
