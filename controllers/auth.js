const User = require('../models/user');
const { validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signUp = (req, res) => {
	const userData = new User(req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const { msg, param } = errors.array()[0];
		return res.status(400).json({ errors: `${param}: ${msg}` });
	}
	return userData.save((err, uData) => {
		if (err) {
			if (err.code === 11000) {
				return res.status(401).json({
					errors: 'User with that email already exists',
					type: 'emailNotUnique',
				});
			}
			return res.status(500).json({
				error: `${err}`,
			});
		}
		return res.json(userData);
	});
};

exports.signIn = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({
		email: email,
	});
	if (user === null) res.status(400).json({ error: 'No such user' });
	let isCorrectUser = await user.authenticatePassword(password);
	if (isCorrectUser) {
		const token = jwt.sign({ id: user._id }, process.env.SECRET);
		res.cookie('token', token, { httpOnly: true });
		res.json({
			message: 'User has been successfully logged in',
			body: {
				token: token,
				user: {
					id: user._id,
					email: user.email,
					role: user.role,
				},
			},
		});
	} else {
		res.status(400).json({ message: 'Incorrect password' });
	}
};

exports.signOut = (req, res) => {
	res.clearCookie('token');
	res.json({ message: 'User signOut' });
};

exports.isSignedIn = expressJwt({
	secret: 'convolutedsecre',
	algorithms: ['HS256'],
	requestProperty: 'auth',
});

exports.isAuthenticated = (req, res, next) => {
	console.log(
		'req.auth.id, req.profile._id :>> ',
		req.auth.id,
		req.profile._id
	);
	if (!(req.auth && req.profile && req.profile._id == req.auth.id)) {
		return res.status(400).send({ message: 'Access Denied' });
	}
	next();
};

exports.isAdmin = (req, res, next) => {
	if (
		!(
			req.auth &&
			req.profile &&
			req.profile._id == req.auth.id &&
			req.profile.role === 1
		)
	) {
		return res.status(400).send({ message: 'Not an admin user' });
	}
	next();

	// next();
};
