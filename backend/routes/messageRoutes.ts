import express from 'express';
import { protect } from '../controllers/authController';
import { getGroupMessages, createMessage } from '../controllers/messageController';

const router = express.Router();

router.route('/').post(protect, createMessage);

router.route('/:id').get(protect, getGroupMessages);

export = router;
