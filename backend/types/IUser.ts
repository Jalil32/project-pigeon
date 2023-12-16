import { Document } from 'mongodb';
export default interface IUser extends Document {
    name: string;
    email: string;
    photo: string;
    role: string;
    password: string | undefined;
    passwordConfirm: string | undefined;
    passwordChangedAt: number | undefined;
    groups: string[];
    passwordResetToken: string | undefined;
    passwordResetExpires: number | undefined;
    active: boolean;
    correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
    changedPasswordAfter: (JWTTimestamp: string) => boolean;
    createPasswordResetToken: () => string;
}
