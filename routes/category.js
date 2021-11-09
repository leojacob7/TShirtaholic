const express = require('express');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const {
	getCategoryId,
	createCategory,
	getCategoryById,
	getCategories,
	updateCategory,
	deleteCategory,
} = require('../controllers/category');
const { getUserById } = require('../controllers/user');
const { body } = require('express-validator');
const router = express.Router();

router.param('userId', getUserById);
router.param('categoryId', getCategoryId);

// get every category
router.get('/category', getCategories);
// get a single category
router.get('/category/:categoryId', getCategoryById);

// create a category but first authenticate him
router.post(
	'/category/create/:userId',
	body('name')
		.isLength({ min: 3 })
		.trim()
		.withMessage('Name must be at least 3 chars long'),
	isSignedIn,
	isAuthenticated,
	isAdmin,
	createCategory
);

// update a category
router.put(
	'/category/:categoryId/:userId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	updateCategory
);

// delete a category
router.delete('/category/:categoryId/', deleteCategory);

module.exports = router;
