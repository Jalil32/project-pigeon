import dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });
import app from './app';
import mongoose from 'mongoose';

process.on('uncaughtException', (err: any) => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            NODE_ENV: string;
            PORT: string;
            URI: string;
            JWT_SECRET: string;
            JWT_EXPIRES_IN: string;
            JWT_COOKIE_EXPIRES_IN: number;
            EMAIL_USERNAME: string;
            EMAIL_PASSWORD: string;
            EMAIL_HOST: string;
            EMAIL_PORT: number;
        }
    }
}

const port: string = process.env.PORT;
const uri: string = process.env.URI;

mongoose.connect(uri, { dbName: 'project-pigeon' }).then(() => {
    console.log('Successfully connected to database\n');
});

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

process.on('unhandledRejection', (err: any) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
