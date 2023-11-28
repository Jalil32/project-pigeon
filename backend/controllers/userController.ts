import { Request, Response } from 'express';
import Users from './../models/userModel';
import Groups from './../models/groupModel';

export const getAllUsers = async (
    req: Request,
    res: Response,
) => {
    try {
        const users = await Users.find();
        console.log(users);
        res.status(200).send({
            status: 'success',
            data: users,
        });
    } catch (err) {
        console.log('could not get users: ' + err);
        res.status(404).send({
            status: 'failure',
        });
    }
};

export const getUser = async (
    req: Request,
    res: Response,
) => {
    try {
        console.log(req.params.id);
        const user = await Users.findById(
            req.params.id,
        );
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
};

export const createUser = async (
    req: Request,
    res: Response,
) => {
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
};

export const deleteUser = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = await Users.findByIdAndDelete(
            req.params.id,
        );
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
            console.log(
                'member removed from group: ' + group,
            );
        }
        res.status(200).send({
            status: 'User successfully deleted',
            data: user,
        });
    } catch (err) {
        console.log(
            'User could not be deleted: ' + err,
        );
        res.status(404).send({
            status: 'Failure. User could not be deleted',
        });
    }
};

export const updateUser = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = await Users.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            },
        );
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
};
