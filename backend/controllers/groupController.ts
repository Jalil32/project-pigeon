import Groups from './../models/groupModel';
import { Request, Response, NextFunction } from 'express';
import Users from './../models/userModel';
import catchAsync from './../utils/catchAsync';
import AppError from '../utils/appError';
import APIFeatures from './../utils/apiFeatures';

export const getAllGroups = catchAsync(async (_req: Request, res: Response) => {
    const groups = await Groups.find();

    res.status(200).send({
        status: 'success',
        results: groups.length,
        data: {
            groups,
        },
    });
});

export const addGroupMember = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // 1) Check if group exists
        const groupExists = await Groups.findById(req.params.id);
        if (!groupExists) {
            return next(new AppError('Group does not exist', 404));
        }
        // 2) Check if user exists
        const userExists = await Users.findById(req.body._id);

        if (!userExists) {
            return next(new AppError('User does not exist', 404));
        }

        // 3) Add user to group
        const group = await Groups.updateOne(
            { _id: req.params.id },
            { $push: { members: req.body._id } },
            { returnDocument: 'after' },
        );

        // 4) Add group to user
        await Users.updateOne({ _id: req.body._id }, { $push: { groups: req.params.id } });

        res.status(200).send({
            status: 'success',
            data: {
                group,
            },
        });
    },
);

export const createGroup = catchAsync(async (req: Request, res: Response) => {
    // Create group
    const group = await Groups.create(req.body);

    console.log('Created group: \n' + group);

    await Users.updateMany({ _id: { $in: group.members } }, { $push: { groups: group._id } });

    res.status(200).send({
        status: 'success',
        data: {
            group,
        },
    });
});

export const deleteGroup = catchAsync(async (req: Request, res: Response) => {
    const group = await Groups.findByIdAndDelete(req.params.id, {
        returnDocument: 'before',
    });

    console.log('group deleted: ' + group);
    if (group) {
        await Users.updateMany(
            {
                groups: {
                    $elemMatch: {
                        $eq: group._id,
                    },
                },
            },
            { $pull: { groups: group._id } },
        );
        console.log('users updated');
    }

    res.status(200).send({
        status: 'success',
        data: {
            group,
        },
    });
});

export const getGroup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const group = await Groups.findById(req.params.id);

    if (!group) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).send({
        status: 'success',
        data: {
            group,
        },
    });
});
