import { Request, Response, NextFunction } from 'express';
import AppError from './../utils/appError';

interface CustomError extends Error {
    path?: string;
    value?: string;
    status: string;
    statusCode: number;
    isOperational?: boolean;
    code?: number;
    errmsg?: string;
    errors?: Object;
}

const sendErrorDev = (err: CustomError, res: Response) => {
    console.log(JSON.stringify(err));
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err: CustomError, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error('ERROR: \n' + JSON.stringify(err));
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};

const handleCastErrorDB = (err: CustomError): CustomError => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: CustomError): CustomError => {
    let value;

    if (err.errmsg) {
        value = err.errmsg.match(/(["'])(\\?.)*?\1/) ?? [undefined];
        console.log(value);
        value = value[0];
    }

    const type = err.errmsg ?? undefined;

    let message = `Duplicate field value ${value}. Please use another value!`;

    if (type && type.includes('email')) {
        message = 'Account with this email already exists. Please login.';
    }

    return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any): CustomError => {
    console.log('ValidationError');
    const errors = Object.values(err.errors).map((el: any) => el.message);
    console.log(errors);
    let message = `${errors.join('. ')}.`;

    // Check if password error
    if (message.includes('minimum allowed length')) {
        message = 'Invalid password. Password must be at least 8 characters long.';
    }

    if (message.includes('passwordConfirm')) {
        message = 'Passwords do not match.';
    }

    return new AppError(message, 400);
};

const handleJsonWebTokenError = (): CustomError => {
    console.log('JsonWebTokenError');
    return new AppError('Invalid token. Please log in again', 401);
};

const handleJWTExpiredError = (): CustomError => {
    console.log('JWTEXpiredError');
    return new AppError('Your token has expired! Please log in again.', 401);
};
const errorHandler = (err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        // Make a copy of the error object so we dont modify the original
        // Note that when using spread operator on an Error object
        // it only copies the object's own enumerable properties
        // which does not include err.name
        let error: CustomError = {
            ...err,
            name: err.name,
            message: err.message,
            errmsg: err.errmsg,
        };
        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
        } else if (error.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        } else if (error.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        } else if (error.name === 'JsonWebTokenError') {
            error = handleJsonWebTokenError();
        } else if (error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError();
        }
        sendErrorProd(error, res);
    }
};

export = errorHandler;
