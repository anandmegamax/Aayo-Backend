import express from 'express';
import { authorizeRoles, isAuthenticatedUser } from '../middlewares/auth.js';
import { createMenu, getMenus } from '../controllers/menuControllers.js';
const router = express.Router();

router.route('/admin/menu/create').post(createMenu)
router.route('/admin/menus').get(getMenus)

export default router;