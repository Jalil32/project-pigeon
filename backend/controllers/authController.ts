import { NextFunction } from 'express';
import User from './../models/userModel';
import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { warn } from 'console';
import catchAsync from '../utils/catchAsync';

const signToken = (id: String) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET ?? '', {
        expiresIn: process.env.JWT_EXPIRES_IN ?? '',
    });
};
export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET ?? '', {
        expiresIn: process.env.JWT_EXPIRES_IN ?? '',
    });

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
    // FIXME: Do we need next function???
    next();
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log('hello');
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);
    // 1) Check if email and password exist
    if (!email || !password) {
        res.status(400).json({
            status: 'failure',
        });
        return;
    }
    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    console.log(user);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({
            status: 'failure',
        });
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
    });
    next();
});

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's therre
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
    }
    // 2) Verifcation token

    // 3) Check if user still exists

    // 4) Check if user cahnged password after the token was issued
    next();
});
