import express from 'express';
import { Express, Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

// 1) APP CONFIGURATION
dotenv.config({ path: 'config.env' });
const port: string = process.env.PORT ?? '3000';
const uri: string = process.env.URI ?? '';
const app: Express = express();

mongoose
    .connect(uri, { dbName: 'project-pigeon' })
    .then(() => {
        console.log('Successfully connected to database\n');
    })
    .catch((err) => {
        console.log('Failed to connect to database: ' + err);
    });

// 2) MIDDLEWARE
app.use(express.static(path.join(__dirname, 'my-app', 'build')));
app.use(express.json());

// 3) SCHEMAS
// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        required: true,
    },
    groups: [{ type: Schema.Types.ObjectId, ref: 'Groups' }],
});

// Group Schema
const groupSchema = new mongoose.Schema({
    name: { type: String, requied: true },
    creator: { type: Schema.Types.ObjectId, ref: 'Users' },
    members: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Messages' }],
});

// Message Schema
const messageSchema = new mongoose.Schema({
    sentFrom: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.UTC },
    recipient: {
        required: true,
        type: Schema.Types.ObjectId,
        refPath: 'onModel',
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Groups', 'Users'],
    },
});

// 4) MODELS
const Users = mongoose.model('Users', userSchema);
const Groups = mongoose.model('Groups', groupSchema);
const Messages = mongoose.model('Messages', messageSchema);

// 5) ROUTES
// Serve React App
app.get('/', (req: Request, res: Response) => {
    //  res.status(200).sendFile("../client/index.html");
    res.sendFile(`${__dirname}/my-app/build/index.html`);
});

// Group Routes
// Get a users groups
app.get('/group:userId', (req: Request, res: Response) => {});

// Create new group
app.post('/group', async (req: Request, res: Response) => {
    try {
        // Create group
        const group = await Groups.create(req.body); // Assign group to users for (let member in group.members) { console.log(member);

        for (let i in group.members) {
            console.log(group.members[i]);
        }


    } catch (err) {
        console.log('Group could not be created: ' + err);
        res.status(404).send({
            status: 'Failure. Group could not be created',
        });
    }
});

// Add user to group
app.post('/group:userId', (req: Request, res: Response) => {});

// Delete a group
app.delete('/group:groupId', (req: Request, res: Response) => {});

// User Routes
// Get all users
app.get('/user', async (req: Request, res: Response) => {
    try {
        const users = await Users.find();
        console.log(users);
        res.status(200).send({
            status: 'success',
            data: users,
        });
    } catch (err) {
        console.log('Could not get users: ' + err);
        res.status(404).send({
            status: 'failure',
        });
    }
});
// get user
app.get('/user/:id', async (req: Request, res: Response) => {
    try {
        console.log(req.params.id);
        const user = await Users.findById(req.params.id);
        console.log(user);
        res.status(200).send({
            status: 'success',
            user: user,
        });
    } catch (err) {
        console.log('Could not find user: ' + err);
        res.status(404).send({
            status: 'failure',
        });
    }
});
// Create a user
app.post('/user', async (req: Request, res: Response) => {
    try {
        await Users.create(req.body);
        res.status(201).send({
            status: 'User successfully created',
        });
    } catch (err: any) {
        if (err.code === 11000) {
            res.status(409).send({
                status: 'An account already exists. Please login',
            });
        } else {
            res.status(400).send({
                status: 'Sorry, an account could not be created at this time',
            });
        }
    }
});

// Delete a user
app.delete('/user/:id', async (req: Request, res: Response) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id);
        res.status(200).send({
            status: 'User successfully deleted',
            data: user,
        });
    } catch (err) {
        console.log('User could not be deleted: ' + err);
        res.status(404).send({
            status: 'Failure. User could not be deleted',
        });
    }
});

// Update a user
app.patch('/user/:id', async (req: Request, res: Response) => {
    try {
        const user = await Users.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).send({
            status: 'Use successfully updated',
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(404).send({
            status: 'User could not be updated',
            message: err,
        });
    }
});
// Message Routes

app.listen(3001, () => {
    console.log(`Server running on http://localhost:${port}`);
});
