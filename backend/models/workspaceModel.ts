import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

// Group Schema
const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A workspace must have a name'],
        unique: [true, 'A workspace with this name already exists.'],
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
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Groups',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    invitationToken: String,
    invitationTokenExpiration: Date,
});

workspaceSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.invitationToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // invite valid for 24 hours
    this.invitationTokenExpiration = Date.now() + 24 * 60 * 60 * 1000;

    return resetToken;
};

const Workspaces = mongoose.model('Workspaces', workspaceSchema);

export = Workspaces;
