"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroup = exports.deleteGroup = exports.createGroup = exports.addGroupMember = exports.getAllGroups = void 0;
const groupModel_1 = __importDefault(require("./../models/groupModel"));
const userModel_1 = __importDefault(require("./../models/userModel"));
const getAllGroups = async (req, res) => {
    try {
        const groups = await groupModel_1.default.find();
        res.status(200).send({
            status: 'success',
            data: {
                groups,
            },
        });
    }
    catch (err) {
        console.log(err);
        res.status(404).send({
            status: 'failure',
        });
    }
};
exports.getAllGroups = getAllGroups;
const addGroupMember = async (req, res) => {
    try {
        const group = await groupModel_1.default.updateOne();
        const user = await userModel_1.default.updateOne({ _id: req.body._id }, { $push: { groups: req.body._id } });
        console.log('Group member added: ' + group);
        console.log('Group added to user: ' + user);
        res.status(200).send({
            status: 'success',
            data: {
                group,
            },
        });
    }
    catch (err) {
        console.log('error occured: ' + err);
        res.status(404).send({
            status: 'failure',
        });
    }
};
exports.addGroupMember = addGroupMember;
const createGroup = async (req, res) => {
    try {
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
    }
    catch (err) {
        console.log('Group could not be created: ' + err);
        res.status(404).send({
            status: 'Failure. Group could not be created',
        });
    }
};
exports.createGroup = createGroup;
const deleteGroup = async (req, res) => {
    try {
        // delete group from each members
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
    }
    catch (err) {
        console.log('Could not delete group' + err);
        res.status(404).send({
            status: 'failure',
            data: {
                error: err,
            },
        });
    }
};
exports.deleteGroup = deleteGroup;
const getGroup = async (req, res) => {
    try {
        const group = await groupModel_1.default.findById(req.params.id);
        res.status(200).send({
            status: 'success',
            data: {
                group,
            },
        });
    }
    catch (err) {
        console.log('Error occured: ' + err);
        res.status(404).send({
            status: 'failure',
        });
    }
};
exports.getGroup = getGroup;
