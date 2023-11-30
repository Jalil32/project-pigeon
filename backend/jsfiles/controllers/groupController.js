"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroup = exports.deleteGroup = exports.createGroup = exports.addGroupMember = exports.getAllGroups = void 0;
const groupModel_1 = __importDefault(require("./../models/groupModel"));
const userModel_1 = __importDefault(require("./../models/userModel"));
const catchAsync_1 = __importDefault(require("./../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
exports.getAllGroups = (0, catchAsync_1.default)(async (_req, res) => {
    const groups = await groupModel_1.default.find();
    res.status(200).send({
        status: 'success',
        results: groups.length,
        data: {
            groups,
        },
    });
});
exports.addGroupMember = (0, catchAsync_1.default)(async (req, res, next) => {
    // 1) Check if group exists
    const groupExists = await groupModel_1.default.findById(req.params.id);
    if (!groupExists) {
        return next(new appError_1.default('Group does not exist', 404));
    }
    // 2) Check if user exists
    const userExists = await userModel_1.default.findById(req.body._id);
    if (!userExists) {
        return next(new appError_1.default('User does not exist', 404));
    }
    // 3) Add user to group
    const group = await groupModel_1.default.updateOne({ _id: req.params.id }, { $push: { members: req.body._id } }, { returnDocument: 'after' });
    // 4) Add group to user
    await userModel_1.default.updateOne({ _id: req.body._id }, { $push: { groups: req.params.id } });
    res.status(200).send({
        status: 'success',
        data: {
            group,
        },
    });
});
exports.createGroup = (0, catchAsync_1.default)(async (req, res) => {
    // Create group
    const group = await groupModel_1.default.create(req.body);
    console.log('Created group: \n' + group);
    await userModel_1.default.updateMany({ _id: { $in: group.members } }, { $push: { groups: group._id } });
    res.status(200).send({
        status: 'success',
        data: {
            group,
        },
    });
});
exports.deleteGroup = (0, catchAsync_1.default)(async (req, res) => {
    const group = await groupModel_1.default.findByIdAndDelete(req.params.id, {
        returnDocument: 'before',
    });
    console.log('group deleted: ' + group);
    if (group) {
        await userModel_1.default.updateMany({
            groups: {
                $elemMatch: {
                    $eq: group._id,
                },
            },
        }, { $pull: { groups: group._id } });
        console.log('users updated');
    }
    res.status(200).send({
        status: 'success',
        data: {
            group,
        },
    });
});
exports.getGroup = (0, catchAsync_1.default)(async (req, res, next) => {
    const group = await groupModel_1.default.findById(req.params.id);
    if (!group) {
        return next(new appError_1.default('No tour found with that ID', 404));
    }
    res.status(200).send({
        status: 'success',
        data: {
            group,
        },
    });
});
