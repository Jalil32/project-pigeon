import dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });
import app from './app';
import mongoose from 'mongoose';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            NODE_ENV: string;
            PORT: string;
            URI: string;
            JWT_SECRET: string;
            JWT_EXPIRES_IN: string;
        }
    }
}

const port: string = process.env.PORT;
const uri: string = process.env.URI;

mongoose
    .connect(uri, { dbName: 'project-pigeon' })
    .then(() => {
        console.log('Successfully connected to database\n');
    })
    .catch((err) => {
        console.log('Failed to connect to database: ' + err);
    });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
