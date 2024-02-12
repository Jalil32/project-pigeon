import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import IUser from './../types/IUser';
import crypto from 'crypto';

const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: [true, 'Please provide your first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your last name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: true,
        // This only works on SAVE and CREATE
        validate: {
            validator: function (this: IUser, el: string) {
                return el === this.password;
            },
        },
        message: 'Passwords do not match',
    },
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Groups',
        },
    ],
    workspaces: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Workspaces',
        },
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: true });
    next();
});

userSchema.pre('save', async function (this: IUser, next: Function): Promise<any> {
    if (!this.isModified('password')) {
        return next();
    }
    if (typeof this.password === 'string') {
        this.password = await bcrypt.hash(this.password, 12);
    }
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) {
        return next();
    }

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance methods
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
    if (this.passwordChangedAt) {
        console.log("comparing passwordChangedAt:", this.passwordChangedAt.getTime() / 1000, "and JWTTimestamp", JWTTimestamp)
        const changedTimestamp: number = this.passwordChangedAt.getTime() / 1000;
        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const Users = mongoose.model('Users', userSchema);

export = Users;
