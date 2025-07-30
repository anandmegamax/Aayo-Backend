import express from 'express';
import { authorizeRoles, isAuthenticatedUser } from '../middlewares/auth.js';
import { createRole, getRoles, updateRolePermissions } from '../controllers/roleController.js';
const router = express.Router();

router.route('/admin/role/create').post(createRole);
router.route('/admin/roles').get(getRoles);
router.route('/admin/role/update/:id').put(updateRolePermissions)

export default router;