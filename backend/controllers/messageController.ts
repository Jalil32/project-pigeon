import Groups from '../models/groupModel';
import Messages from '../models/messageModel';
import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';

export const createMessage = catchAsync(async (req: Request, res: Response) => {
    // 1) create message entry in Messages
    const message = await Messages.create(req.body);
    console.log('Message created: \n' + message);

    // 3) Return response
    res.status(201).send({
        status: 'success',
        data: {
            message,
        },
    });
});

export const getGroupMessages = catchAsync(async (req: Request, res: Response) => {
    // 1) Get groups messages using group id from url params
    const messages = await Messages.find({ recipient: req.params.id }).sort();

    // 2) Return response
    res.status(200).send({
        status: 'success',
        data: {
            messages,
        },
    });
});
