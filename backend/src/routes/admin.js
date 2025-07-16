const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const adminController = require('../controllers/adminController');

// All admin routes require authentication
router.use(auth);

// GET /admin/users
router.get('/users', rbac('admin'), adminController.listUsers);

// PATCH /admin/users/:id/roles
router.patch('/users/:id/roles', rbac('admin'), adminController.updateUserRoles);

// DELETE /admin/users/:id
router.delete('/users/:id', rbac('admin'), adminController.deleteUser);

module.exports = router; 