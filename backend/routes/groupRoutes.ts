import express from 'express';
import {
    createGroup,
    getAllGroups,
    getGroup,
    addGroupMember,
    deleteGroup,
} from './../controllers/groupController';
import { protect, restrictTo } from './../controllers/authController';

const router = express.Router();

router.route('/').get(protect, getAllGroups).post(createGroup);

router
    .route('/:id')
    .get(protect, getGroup)
    .patch(protect, addGroupMember)
    .delete(protect, restrictTo('admin'), deleteGroup);

export = router;
