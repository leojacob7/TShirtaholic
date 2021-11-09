const express = require('express');
const router = express.Router();
const { signUp, signIn, signOut } = require('../controllers/auth');
const {
	getUserById,
	getUser,
	updateUsers,
	getOrdersPerUser,
} = require('../controllers/user');
const { isAuthenticated, isSignedIn, isAdmin } = require('../controllers/auth');
const { body } = require('express-validator');

router.param('userId', getUserById);

router.get('/user/:userId', isSignedIn, isAuthenticated, isAdmin, getUser);
router.put('/user/:userId', isSignedIn, isAuthenticated, updateUsers);

// get the order details with the user data populated
// i.e _id and name instead of the normal id parameter
router.get(
	'/orders/user/:userId',
	isSignedIn,
	isAuthenticated,
	getOrdersPerUser
);
module.exports = router;
