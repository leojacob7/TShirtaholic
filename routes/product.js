const express = require('express');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const router = express.Router();
const {
	getProductById,
	createProduct,
	getProduct,
	getPhoto,
	updateProduct,
	deleteProduct,
	getAllProducts,
} = require('../controllers/product');
const { getUserById } = require('../controllers/user');

router.param('userId', getUserById);
router.param('productId', getProductById);

// get product by id
router.get('/products', isSignedIn, isAuthenticated, getProductById);
router.post(
	'/products/create/:userId',
	isSignedIn,
	isAuthenticated,
	createProduct
);

// get product
router.get('/products/:productId', isSignedIn, isAuthenticated, getProduct);
router.get('/products/:productId/photo', isSignedIn, isAuthenticated, getPhoto);

// update product
router.post(
	'/products/:userId/:productId/update',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	updateProduct
);

router.delete(
	'/products/:userId/:productId/delete',
	isSignedIn,
	isAdmin,
	isAuthenticated,
	deleteProduct
);

router.get('/products/:userId/getAll', getAllProducts);

module.exports = router;
