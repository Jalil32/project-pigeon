import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: 'config.env' });

const port: string = process.env.PORT ?? '3000';
const uri: string = process.env.URI ?? '';

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
