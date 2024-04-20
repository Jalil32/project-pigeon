import Workspaces from '../models/workspaceModel';
import crypto from 'crypto';
import Users, { findByIdAndDelete } from '../models/userModel';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import Invitations from '../models/invitationModel';
import AppError from '../utils/appError';

export const createWorkspace = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // Add new workspace to DB
        const createdWorkspace = await Workspaces.create(req.body);

        console.log('workspace created');
        // Add workspace to user who created it
        await Users.updateOne(
            { _id: req.body.creator },
            { $push: { workspaces: createdWorkspace._id } },
        );

        // Send back the newly created Workspace
        res.status(201).send({
            status: 'success',
            workspace: createdWorkspace,
        });
    },
);

export const changeName = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const workspace = await Workspaces.findByIdAndUpdate(req.params.workspaceId, req.body, {
        new: true,
    });

    res.status(200).send({
        status: 'success',
        workspace: workspace,
    });
});

export const getWorkspace = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const workspace = await Workspaces.findById(req.params.workspaceId);
    console.log('yes');
    console.log(workspace);

    res.status(200).send({
        status: 'success',
        workspace: workspace,
    });
});

export const deleteWorkspace = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const workspace = await Workspaces.findByIdAndDelete(req.params.workspaceId, {
            returnDocument: 'before',
        });

        res.status(200).send({
            status: 'success',
            workspace,
        });
    },
);

export const addUserToWorkspace = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // hash token
        console.log('testtttt');
        console.log('token', req.body.token);
        const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
        console.log(hashedToken);

        // get the invitation by token
        const invitation = await Invitations.findOne({
            invitationToken: hashedToken,
            invitationTokenExpiration: { $gt: Date.now() },
        });

        if (!invitation) {
            return next(new AppError('Incorrect or expired token!', 400));
        }

        if (invitation.status === 'accepted') {
            return next(new AppError('This invitation has already been used!', 400));
        }

        // set status of invitation to accepted
        invitation.status = 'accepted';
        await invitation.save();

        // add the user to the workspace
        console.log('adding user to workspace', req.params.userId);
        const updatedWorkspace = await Workspaces.findByIdAndUpdate(
            invitation.workspace,
            {
                $push: { members: req.params.userId },
            },

            { returnDocument: 'after' },
        );

        console.log('user added to workspace', updatedWorkspace);

        // Add workspace to user

        console.log('adding workspace to user', invitation.workspace);

        const response = await Users.findByIdAndUpdate(
            req.params.userId,
            {
                $push: { workspaces: invitation.workspace },
            },
            { new: true },
        );

        console.log('workspace added to user', response);

        // Send back the updated workspace
        res.status(200).send({
            status: 'success',
            data: {
                workspaceId: updatedWorkspace?._id,
            },
        });
    },
);
