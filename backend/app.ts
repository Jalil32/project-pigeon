import express, { Express } from 'express';
import path from 'path';
import userRouter from './routes/userRoutes';
import groupRouter from './routes/groupRoutes';
import reactAppRouter from './routes/reactAppRoutes';

const app: Express = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.static(path.join(__dirname, 'my-app', 'build')));

// ROUTES
app.use('/', reactAppRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/group', groupRouter);

export = app;
