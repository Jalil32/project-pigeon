import express, { Express, NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import path, { win32 } from 'path';
import userRouter from './routes/userRoutes';
import groupRouter from './routes/groupRoutes';
import reactAppRouter from './routes/reactAppRoutes';
import morgan from 'morgan';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';

const app: Express = express();

// 1) GLOBAL MIDDLEWARE

// Set security HTTP headers
app.use(helmet());

// Log http requests to console if in dev env
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Allow access from react client
app.use(
    cors({
        origin: 'http://localhost:3000',
    }),
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter polution
app.use(
    hpp({
        whitelist: [],
    }),
);

// Data sanitization against XSS
// TODO: add xss sanitization

// Serving static files
app.use(express.static(path.join(__dirname, 'my-app', 'build')));

// ROUTES
app.use('/', reactAppRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/group', groupRouter);

app.all('*', (req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.url} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
// This is called if any value is passed to next anywhere in the application
app.use(globalErrorHandler);
export = app;
