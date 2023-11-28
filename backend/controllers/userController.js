"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.createUser = exports.getUser = exports.getAllUsers = void 0;
const userModel_1 = __importDefault(require("./../models/userModel"));
const groupModel_1 = __importDefault(require("./../models/groupModel"));
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel_1.default.find();
        console.log(users);
        res.status(200).send({
            status: 'success',
            data: users,
        });
    }
    catch (err) {
        console.log('could not get users: ' + err);
        res.status(404).send({
            status: 'failure',
        });
    }
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res) => {
    try {
        console.log(req.params.id);
        const user = await userModel_1.default.findById(req.params.id);
        console.log(user);
        res.status(200).send({
            status: 'success',
            user: user,
        });
    }
    catch (err) {
        console.log('Could not find user: ' + err);
        res.status(404).send({
            status: 'failure',
        });
    }
};
exports.getUser = getUser;
const createUser = async (req, res) => {
    try {
        await userModel_1.default.create(req.body);
        res.status(201).send({
            status: 'User successfully created',
        });
    }
    catch (err) {
        if (err.code === 11000) {
            res.status(409).send({
                status: 'An account already exists. Please login',
            });
        }
        else {
            res.status(400).send({
                status: 'Sorry, an account could not be created at this time',
            });
        }
    }
};
exports.createUser = createUser;
const deleteUser = async (req, res) => {
    try {
        const user = await userModel_1.default.findByIdAndDelete(req.params.id);
        if (user) {
            const group = await groupModel_1.default.updateMany({
                members: {
                    $elemMatch: {
                        $eq: user._id,
                    },
                },
            }, { $pull: { members: user._id } });
            console.log('member removed from group: ' + group);
        }
        res.status(200).send({
            status: 'User successfully deleted',
            data: user,
        });
    }
    catch (err) {
        console.log('User could not be deleted: ' + err);
        res.status(404).send({
            status: 'Failure. User could not be deleted',
        });
    }
};
exports.deleteUser = deleteUser;
const updateUser = async (req, res) => {
    try {
        const user = await userModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).send({
            status: 'Use successfully updated',
            data: {
                user,
            },
        });
    }
    catch (err) {
        res.status(404).send({
            status: 'User could not be updated',
            message: err,
        });
    }
};
exports.updateUser = updateUser;
