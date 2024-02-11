import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

const invitationSchema = new mongoose.Schema({
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspaces',
    },
    inviteeEmail: String,
    invitationToken: {
        type: String,
        unique: true,
    },
    invitationTokenExpiration: Date,
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending',
    },
});

const Invitations = mongoose.model('Invitations', invitationSchema);

export default Invitations;
