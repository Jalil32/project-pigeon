import Groups from './../models/groupModel';
import { Request, Response } from 'express';
import Users from './../models/userModel';

export const getAllGroups = async (
    req: Request,
    res: Response,
) => {
    try {
        const groups = await Groups.find();
        res.status(200).send({
            status: 'success',
            data: {
                groups,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(404).send({
            status: 'failure',
        });
    }
};

export const addGroupMember = async (
    req: Request,
    res: Response,
) => {
    try {
        const group = await Groups.updateOne();
        const user = await Users.updateOne(
            { _id: req.body._id },
            { $push: { groups: req.body._id } },
        );
        console.log('Group member added: ' + group);
        console.log('Group added to user: ' + user);
        res.status(200).send({
            status: 'success',
            data: {
                group,
            },
        });
    } catch (err) {
        console.log('error occured: ' + err);
        res.status(404).send({
            status: 'failure',
        });
    }
};

export const createGroup = async (
    req: Request,
    res: Response,
) => {
    try {
        // Create group
        const group = await Groups.create(req.body);

        console.log('Created group: \n' + group);

        await Users.updateMany(
            { _id: { $in: group.members } },
            { $push: { groups: group._id } },
        );

        res.status(200).send({
            status: 'success',
            data: {
                group,
            },
        });
    } catch (err) {
        console.log(
            'Group could not be created: ' + err,
        );
        res.status(404).send({
            status: 'Failure. Group could not be created',
        });
    }
};

export const deleteGroup = async (
    req: Request,
    res: Response,
) => {
    try {
        // delete group from each members
        const group = await Groups.findByIdAndDelete(
            req.params.id,
            {
                returnDocument: 'before',
            },
        );

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
    } catch (err) {
        console.log('Could not delete group' + err);
        res.status(404).send({
            status: 'failure',
            data: {
                error: err,
            },
        });
    }
};

export const getGroup = async (
    req: Request,
    res: Response,
) => {
    try {
        const group = await Groups.findById(
            req.params.id,
        );
        res.status(200).send({
            status: 'success',
            data: {
                group,
            },
        });
    } catch (err) {
        console.log('Error occured: ' + err);
        res.status(404).send({
            status: 'failure',
        });
    }
};
