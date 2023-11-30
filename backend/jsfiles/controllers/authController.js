"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = exports.login = exports.signup = void 0;
const userModel_1 = __importDefault(require("./../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
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
    const user = await userModel_1.default.findOne({ email }).select('+password');
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
exports.protect = (0, catchAsync_1.default)(async (req, res, next) => {
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
