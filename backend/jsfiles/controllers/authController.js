"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = exports.login = exports.signup = void 0;
const userModel_1 = __importDefault(require("./../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id: id }, process.env.JWT_SECRET ?? '', {
        expiresIn: process.env.JWT_EXPIRES_IN ?? '',
    });
};
exports.signup = (0, catchAsync_1.default)(async (req, res, next) => {
    const newUser = await userModel_1.default.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    const token = jsonwebtoken_1.default.sign({ id: newUser._id }, process.env.JWT_SECRET ?? '', {
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
exports.login = (0, catchAsync_1.default)(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    // 1) Check if email and password exist
    if (!email || !password) {
        next(new appError_1.default('No email or password given. Please enter these details', 401));
        return;
    }
    // 2) Check if user exists and password is correct
    const user = await userModel_1.default.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new appError_1.default('Incorrect password or email. Please try again.', 401));
    }
    // 3) If everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
    });
    next();
});
const jwtVerify = (token, secret) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secret, {}, (err, payload) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(payload);
            }
        });
    });
};
exports.protect = (0, catchAsync_1.default)(async (req, res, next) => {
    // 1) Getting token and check if it's therre
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new appError_1.default('You are not logged in! Please log in to get access.', 401));
    }
    // 2) Verification token
    const decoded = await jwtVerify(token, process.env.JWT_SECRET);
    console.log(decoded);
    // 3) Check if user still exists
    const freshUser = await userModel_1.default.findById(decoded.id);
    if (!freshUser) {
        return next(new appError_1.default('The user belonging to this token no longer exists!', 401));
    }
    // 4) Check if user changed password after the token was issued
    freshUser.changedPasswordAfter(decoded.iat);
    next();
});
