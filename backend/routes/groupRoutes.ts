import express from 'express';
import {
    createGroup,
    getAllGroups,
    getGroup,
    addGroupMember,
    deleteGroup,
} from './../controllers/groupController';

const router = express.Router();

router.route('/').get(getAllGroups).post(createGroup);

router
    .route('/:id')
    .get(getGroup)
    .patch(addGroupMember)
    .delete(deleteGroup);

export = router;
