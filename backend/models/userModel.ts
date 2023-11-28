import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [
            validator.isEmail,
            'Please provide a valid email',
        ],
    },
    photo: String,
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        required: true,
    },
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Groups',
        },
    ],
});

const Users = mongoose.model('Users', userSchema);

export = Users;
