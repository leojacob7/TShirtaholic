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
	if (!email || !password) {
		return res
			.status(400)
			.send({ error: 'Please enter a valid email and password' });
	}
	const user = await User.findOne({
		email: email,
	});
	if (user === null) res.status(400).json({ error: 'No such user' });
	let isCorrectUser = await user.authenticatePassword(password);
	if (isCorrectUser) {
		const token = jwt.sign({ id: user._id }, process.env.SECRET);
		res.cookie('token', token, {
			expires: new Date(Date.now() + 900000),
			httpOnly: true,
			secure: true,
		});
		res.json({
			message: 'User has been successfully logged in',
			body: {
				token: token,
				user: {
					id: user._id,
					email: user.email,
					role: user.role,
					name: user.name,
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

// exports.isSignedIn = expressJwt({
// 	secret: 'convolutedsecre',
// 	algorithms: ['HS256'],
// 	requestProperty: 'auth',
// });

// old method above we were using expressJwt
// this was to create a signed in token to validate
// now we will directly use jwt.verify to validate it
exports.isSignedIn = async (req, res, next) => {
	const bearerToken = req.headers.authorization?.split(' ')[1];
	console.log('req.cookie :>> ', req.cookies);
	console.log('req.cookie :>> ', bearerToken);
	const token = req.cookies.token || bearerToken;
	console.log('token :>> ', token);

	if (!token) {
		return res.status(403).json({
			message: 'User has not logged in ',
			isLoggedIn: false,
			isValidToken: false,
		});
	} else {
		try {
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
				// set auth to be data.id
				req.auth = { id: data.id };
				next();
			}
		} catch (er) {
			return res.status(500).send(er);
		}
	}
};

exports.isAuthenticated = (req, res, next) => {
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

exports.getAuthToken = async (req, res) => {
	const bearerToken = req.headers.authorization?.split(' ')[1];
	// console.log('req.cookie :>> ', req.cookies);
	// console.log('req.cookie :>> ', bearerToken);
	const token = req.cookies.token || bearerToken;
	// console.log('token :>> ', token);
	if (!token) {
		return res.status(403).json({
			message: 'User has not logged in ',
			isLoggedIn: false,
			isValidToken: false,
		});
	} else {
		try {
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
};
