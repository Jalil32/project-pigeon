import { Request, Response, NextFunction } from 'express';
import Users from './../models/userModel';
import Groups from './../models/groupModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import CustomRequest from '../types/CustomRequest';
import IUser from '../types/IUser';

interface DynamicObject {
    [key: string]: any;
}

const filterObj = (obj: DynamicObject, ...allowedFields: string[]) => {
    const newObj: DynamicObject = {};
    Object.keys(obj).forEach((el: string) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });

    return newObj;
};

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await Users.find();
    console.log(users);
    res.status(200).json({
        status: 'success',
        data: users,
    });
});

export const getGroupsUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await Users.find({ workspaces: req.params.id });

    res.status(200).send({
        status: 'success',
        users,
    });
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
    const user = await Users.findById(req.params.id);
    res.status(200).send({
        status: 'success',
        user,
    });
});

export const createUser = catchAsync(async (req: Request, res: Response) => {
    await Users.create(req.body);
    console.log(req.body.passwordChangedAt);
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

export const updateMe = catchAsync(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        // 1) Create error if user POSTs password data
        if (req.body.password || req.body.passwordConfirm) {
            return next(
                new AppError(
                    'This route is not for password udpates. Please use /updateMyPassword',
                    400,
                ),
            );
        }
        // 2) Update user document
        const filteredBody: DynamicObject = filterObj(req.body, 'name', 'email');

        const updatedUser: IUser | null = await Users.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser,
            },
        });
    },
);

export const deleteMe = catchAsync(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        await Users.findByIdAndUpdate(req.user.id, { active: false });

        res.status(204).json({
            status: 'success',
            data: null,
        });
    },
);
