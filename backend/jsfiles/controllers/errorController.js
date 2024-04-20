"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const appError_1 = __importDefault(require("./../utils/appError"));
const sendErrorDev = (err, res) => {
    console.log(JSON.stringify(err));
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        console.error('ERROR: \n' + JSON.stringify(err));
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new appError_1.default(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    let value;
    if (err.errmsg) {
        value = err.errmsg.match(/(["'])(\\?.)*?\1/) ?? [undefined];
        value = value[0];
    }
    const message = `Duplicate field value ${value}. Please use another value!`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    console.log('ValidationError');
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new appError_1.default(message, 400);
};
const handleJsonWebTokenError = () => {
    console.log('JsonWebTokenError');
    return new appError_1.default('Invalid token. Please log in again', 401);
};
const handleJWTExpiredError = () => {
    console.log('JWTEXpiredError');
    return new appError_1.default('Your token has expired! Please log in again.', 401);
};
const errorHandler = (err, _req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        // Make a copy of the error object so we dont modify the original
        // Note that when using spread operator on an Error object
        // it only copies the object's own enumerable properties
        // which does not include err.name
        let error = {
            ...err,
            name: err.name,
            message: err.message,
            errmsg: err.errmsg,
        };
        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
        }
        else if (error.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }
        else if (error.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        }
        else if (error.name === 'JsonWebTokenError') {
            error = handleJsonWebTokenError();
        }
        else if (error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError();
        }
        sendErrorProd(error, res);
    }
};
module.exports = errorHandler;
