import express from 'express';
import { createRole, deleteUser, forgotPassword, getAllPermissions, getAllUsers, getRoles, getUserDetails, getUserProfile, loginUser, logoutUser, registerUser, resetPassword, updatePassword, updateProfile, updateUserDetails, uploadAvatar } from '../controllers/authControllers.js';
import { authorizeRoles, isAuthenticatedUser } from '../middlewares/auth.js';
const router = express.Router();

router.route('/register').post(registerUser)
router.route('/admin/roles').post(isAuthenticatedUser, authorizeRoles('admin'), createRole);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);
router.route('/me/upload_avatar').put(isAuthenticatedUser, uploadAvatar);
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.route('/admin/permissions').get(isAuthenticatedUser, authorizeRoles('admin'), getAllPermissions);
router.route('/admin/roles').get(isAuthenticatedUser, authorizeRoles('admin'), getRoles);
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUserDetails)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);
router.route('/logout').get(logoutUser);

export default router;