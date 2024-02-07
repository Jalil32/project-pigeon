import express from 'express';
import {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe,
    getGroupsUsers,
} from './../controllers/userController';
import {
    signup,
    login,
    forgotPassword,
    resetPassword,
    protect,
    updatePassword,
    validateUser,
} from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.get('/validateUser', protect, validateUser);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(protect, getUser).patch(updateUser).delete(deleteUser);

router.route('/group/:id').get(protect, getGroupsUsers);

export = router;
