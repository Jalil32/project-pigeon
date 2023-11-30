import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
    name: string;
    email: string;
    photo: string;
    password: string;
    passwordConfirm: string | undefined;
    groups: string[];
    correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: true,
        // This only works on SAVE and SAVE
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
});

userSchema.pre('save', async function (this: IUser, next: Function) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const Users = mongoose.model('Users', userSchema);

export = Users;
