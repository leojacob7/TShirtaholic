const express = require('express');
const router = express.Router();
const {
	signUp,
	signIn,
	signOut,
	isSignedIn,
	getAuthToken,
} = require('../controllers/auth');
const { body } = require('express-validator');
const User = require('../models/user');
var jwt = require('jsonwebtoken');

router.post(
	'/signUp',
	body('name')
		.custom((val) => val.length >= 3)
		.withMessage('must be at least 3 chars long'),
	body('email').isEmail().withMessage('must be of email format'),
	body('password')
		.isLength(8)
		.withMessage('password must be at least 8 character long'),
	signUp
);
router.post('/signIn', signIn);
router.post('/signOut', signOut);
router.get('/getToken', getAuthToken);
router.post('/test', isSignedIn, (req, res) => {
	console.log('req.here :>> ', req.auth);
	try {
		if (req.auth) {
			return res.json({ message: 'Protected route' });
		}
		console.log('req :>> ', req.auth);
		res.status(400).json({ message: 'ACCESS DENIED', reqq: req.admin });
	} catch (error) {
		res.status(400).json({ message: 'ACCESS DENIED', reqq: req.admin });
	}
});
module.exports = router;

customSignUpValidator = (req, res) => {
	body('name').custom((val) => val.length > 3);
};
