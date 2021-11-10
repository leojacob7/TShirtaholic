const express = require('express');
const router = express.Router();
const { signUp, signIn, signOut, isSignedIn } = require('../controllers/auth');
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
router.get('/getToken', async (req, res) => {
	const bearerToken = req.headers.authorization?.split(' ')[1];
	console.log('req.cookie :>> ', bearerToken);
	const token = req.cookie || bearerToken;
	console.log('token :>> ', token);
	if (!token) {
		return res.status(403).json({
			message: 'User has not logged in ',
			isLoggedIn: false,
			isValidToken: false,
		});
	} else {
		try {
			console.log('test');

			const data = await jwt.verify(token, 'convolutedsecre');
			console.log('verifying token', data);
			if (!jwt.verify(token, process.env.SECRET)) {
				console.log('token is invalid');
				throw {
					message: 'Invalid token',
					isLoggedIn: false,
					isValidToken: false,
				};
			} else {
				console.log('here after verify jwt');
				const data = jwt.verify(token, process.env.SECRET);
				User.findById(data.id)
					.select({
						salt: 0,
						privatePassword: 0,
						createdAt: 0,
						updatedAt: 0,
					})
					.exec(function (err, user) {
						if (err || !user) {
							return res.json({ message: 'No such user' });
						}
						req.profile = user;
						return res.json({ token, user });
					});
			}
		} catch (er) {
			return res.status(500).send(er);
		}
	}
});
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
