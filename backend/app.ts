import express, { ErrorRequestHandler, Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import userRouter from './routes/userRoutes';
import groupRouter from './routes/groupRoutes';
import reactAppRouter from './routes/reactAppRoutes';
import morgan from 'morgan';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';

const app: Express = express();

// MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
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
