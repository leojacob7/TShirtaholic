const express = require('express');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const {
	getOrderByID,
	createOrder,
	getAllOrders,
} = require('../controllers/order');
const { getUserById, addToUserPurchaseList } = require('../controllers/user');
const router = express.Router();

console.log('here');
router.param('userId', getUserById);
router.param('orderId', getOrderByID);

// TODO: check if we need this to get the order
//router.get('/order/:orderId', getOrderByID);

// create a new order
//       1. check isSignedIn, isAuthenticated
//       2. createOrder
// TODO: 3. push to users order list
// TODO: 4. update stock
router.post(
	'/order/create/:userId',
	isSignedIn,
	isAuthenticated,
	createOrder,
	addToUserPurchaseList
	// updateStocks
);

router.get('/order/all/:userId', getAllOrders);

module.exports = router;
