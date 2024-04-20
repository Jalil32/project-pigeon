import { CookieOptions, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import User from './../models/userModel';
import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import sendEmail from '../utils/email';
import crypto from 'crypto';
import IUser from '../types/IUser';
import CustomRequest from '../types/CustomRequest';

const signToken = (id: ObjectId) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
    const token = signToken(user._id);
    const cookieOptions: CookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        sameSite: 'lax',
        httpOnly: true,
        secure: false,
    };

    if (process.env.NODE_ENV === 'production') {
        // REMEMBER TO CHANGE THIS BACK TO TRUE
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    console.log('sending token');

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: user,
        },
    });
};

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
    });

    createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    // 1) Check if email and password exist
    if (!email || !password) {
        next(new AppError('No email or password given. Please enter these details', 401));
        return;
    }
    // 2) Check if user exists and password is correct
    const user: IUser = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password as string))) {
        return next(new AppError('Incorrect password or email. Please try again.', 401));
    }
    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
});

const jwtVerify = (token: string, secret: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, {}, (err, payload) => {
            if (err) {
                reject(err);
            } else {
                resolve(payload);
            }
        });
    });
};

export const protect = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's therre
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verification token
    const decoded = await jwtVerify(token, process.env.JWT_SECRET);
    console.log(decoded);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists!', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again', 401));
    }

    req.user = currentUser;
    next();
});

export const validateUser = catchAsync(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        res.status(200).json({
            status: 'success',
            message: 'You are logged in!',
        });
    },
);

export const restrictTo = (...roles: any) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        // roles could be ['admin']
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

export const forgotPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // 1) Get user based on POSTed email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(new AppError('There is no user with this email address.', 404));
        }
        // 2) Generate the random reset token

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // 3) Send it to the user's email
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset/${resetToken}`;

        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                message,
            });

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!',
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            await user.save({ validateBeforeSave: false });

            return next(
                new AppError('There was an error sending the email. Try again later!', 500),
            );
        }
    },
);

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    // 1) Get user based on the token

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError('Incorrect or expired token!', 400));
    }

    // 2) If token has not expired, and there is user, set the new password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        // 1) Get user from collection
        // Remember that password is by default not included
        const user = await User.findById(req.user._id).select('+password');

        // 2) Check if POSTed current password is correct
        if (
            !user ||
            !(await user.correctPassword(req.body.passwordCurrent, user.password as string))
        ) {
            return next(new AppError('Incorrect password. Please try again!', 401));
        }
        // 3) Update password
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        // 4) Log user in, send JWT
        createSendToken(user, 200, res);
    },
);
