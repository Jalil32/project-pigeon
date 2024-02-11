import Workspaces from '../models/workspaceModel';
import Users from '../models/userModel';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import Invitations from '../models/invitationModel';
import crypto from 'crypto';
import sendEmail from '../utils/email';
import AppError from '../utils/appError';

export const createInvitation = catchAsync(
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
            data: createdWorkspace,
        });
    },
);

export const handleInvitations = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        console.log('inviting!');
        const workspace = req.body.workspaceId;
        const inviteeEmails = req.body.inviteeEmails;
        console.log(inviteeEmails);

        for (let inviteeEmail of inviteeEmails) {
            // create token
            const resetToken = crypto.randomBytes(32).toString('hex');
            let invitationToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            console.log('token created for', inviteeEmail);
            // make sure token is unique
            while (
                (await Invitations.findOne({ invitationToken: invitationToken }).exec()) !== null
            ) {
                invitationToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            }

            // set token to expire in 24 hours
            const invitationTokenExpiration = Date.now() + 24 * 60 * 60 * 1000;

            // store invitation in database

            console.log('creating new invitation in db');

            const newInvite = await Invitations.create({
                workspace,
                inviteeEmail,
                invitationToken: invitationToken,
                invitationTokenExpiration,
            });

            console.log('invite created in db', newInvite);

            const link = `${process.env.INVITATION_LINK + resetToken}`;
            console.log('the invitation link is:', link);

            // send out the invitation
            try {
                await sendEmail({
                    email: inviteeEmail,
                    subject: 'Invitation to Pigeon Workspace',
                    message: `You have been invited to join a Pigeon Workspace. Use the link below to join!\n${link}`,
                });
            } catch (err) {
                // delete the token if error occurs
                await Invitations.deleteOne({ invitationToken: invitationToken });

                return next(
                    new AppError(
                        'There was an error sending the invitation. Try again later!',
                        500,
                    ),
                );
            }
        }

        res.status(200).send({
            status: 'success',
            message: 'Invitations sent!',
        });
    },
);
