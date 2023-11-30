"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.createUser = exports.getUser = exports.getAllUsers = void 0;
const userModel_1 = __importDefault(require("./../models/userModel"));
const groupModel_1 = __importDefault(require("./../models/groupModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const users = await userModel_1.default.find();
    console.log(users);
    res.status(200).send({
        status: 'success',
        data: users,
    });
});
exports.getUser = (0, catchAsync_1.default)(async (req, res) => {
    console.log(req.params.id);
    const user = await userModel_1.default.findById(req.params.id);
    console.log(user);
    res.status(200).send({
        status: 'success',
        user: user,
    });
});
exports.createUser = (0, catchAsync_1.default)(async (req, res) => {
    await userModel_1.default.create(req.body);
    res.status(201).send({
        status: 'User successfully created',
    });
});
exports.deleteUser = (0, catchAsync_1.default)(async (req, res) => {
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
});
exports.updateUser = (0, catchAsync_1.default)(async (req, res) => {
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
});
