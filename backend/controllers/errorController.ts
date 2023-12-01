import { Request, Response, NextFunction } from 'express';

interface OperationalError extends Error {
    status: string;
    statusCode: number;
    isOperational: boolean;
}

const sendErrorDev = (err: OperationalError, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err: OperationalError, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error('ERROR: \n' + err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};

const errorHandler = (err: OperationalError, _req: Request, res: Response, _next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    }
};

export = errorHandler;
