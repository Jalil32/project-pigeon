import { Request, Response } from 'express';
import Users from './../models/userModel';
import Groups from './../models/groupModel';
import catchAsync from '../utils/catchAsync';

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await Users.find();
    console.log(users);
    res.status(200).send({
        status: 'success',
        data: users,
    });
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
    console.log(req.params.id);
    const user = await Users.findById(req.params.id);
    console.log(user);
    res.status(200).send({
        status: 'success',
        user: user,
    });
});

export const createUser = catchAsync(async (req: Request, res: Response) => {
    await Users.create(req.body);
    res.status(201).send({
        status: 'User successfully created',
    });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (user) {
        const group = await Groups.updateMany(
            {
                members: {
                    $elemMatch: {
                        $eq: user._id,
                    },
                },
            },
            { $pull: { members: user._id } },
        );
        console.log('member removed from group: ' + group);
    }
    res.status(200).send({
        status: 'User successfully deleted',
        data: user,
    });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
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
});
