const User = require('../models/user');
const Order = require('../models/order');

const getUserById = (req, res, next, id) => {
	User.findById(id)
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
			next();
		});
};

// const getUserById = (req, res, next, id) => {
//     Order.findById(user: )
// }

const updateUsers = (req, res, next) => {
	const query = { _id: req.profile._id };

	const update = {
		$set: req.body,
	};

	const options = {
		useFindAndModify: false,
		new: true,
		fields: {
			salt: 0,
			privatePassword: 0,
			createdAt: 0,
			updatedAt: 0,
		},
	};

	User.findByIdAndUpdate(query, update, options, (err, user) => {
		if (!user) {
			res.status(404).json({ error: 'No such user' });
		}
		if (err) {
			return res.status(400).json({ message: 'Not authorised' });
		}

		res.json(user);
		// next();
	});
	// next();
};

const getUser = (req, res) => {
	return res.send(req.profile);
};

const getOrdersPerUser = (req, res) => {
	Order.find({ user: req.profile._id })
		.populate('user', '_id email')
		.exec((error, order) => {
			if (error) {
				return res.status(404).send('No such user');
			}
			return res.json({ order });
		});
};

// TODO: add a middleware to update the purchase list

const addToUserPurchaseList = async (req, res, next) => {
	const user = req.profile;
	console.log('user :>> ', user);
	await Order.find({ user: req.profile._id }).exec(async (err, order) => {
		if (err) {
			return res.status(404).send('No such user');
		} else {
			user.purchases = order;
			user.save((err, updatedUser) => {
				if (err) {
					return res.status(500).json({
						message: 'Unable to update user',
						err,
					});
				}
			});
		}
	});
};

module.exports = {
	getUserById,
	getUser,
	updateUsers,
	getOrdersPerUser,
	addToUserPurchaseList,
};
