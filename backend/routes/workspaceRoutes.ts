import {
    addUserToWorkspace,
    createWorkspace,
    getWorkspace,
} from '../controllers/workspaceController';
import { protect } from '../controllers/authController';
import express from 'express';
import { handleInvitations } from '../controllers/invitationController';

const router = express.Router();

router.route('/').post(protect, createWorkspace);
router.route('/:userId').patch(protect, addUserToWorkspace);
router.route('/invite').post(protect, handleInvitations);
router.route('/:workspaceId').get(protect, getWorkspace);

export = router;
