import express from 'express';
import { authorizeRoles, isAuthenticatedUser } from '../middlewares/auth.js';
import { createPermission, getPermissions } from '../controllers/permissionController.js';
const router = express.Router();

router.route('/admin/permission/create').post(createPermission);
router.route('/admin/permissions').get(getPermissions);

export default router;