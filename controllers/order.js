const Order = require('../models/order');

// getOrderByID is a middleware driven by the router.param
exports.getOrderByID = (req, res, next, id) => {
	Order.findById(id)
		.populate('products.product', 'count name price')
		.exec((err, order) => {
			if (err || lodash.isEmpty(order)) {
				return res.status(404).json({
					message: 'Order not found',
					error: err,
				});
			} else {
				req.order = order;
				next();
			}
		});
};

exports.createOrder = async (req, res, next) => {
	console.log('req.profile :>> ', req.profile);
	req.body.order.user = req.profile;
	const order = await new Order(req.body.order);
	order.save((err, newOrder) => {
		if (err) {
			return res.status(500).json({ message: err });
		} else {
			res.status(200).json({ message: 'Created new order', newOrder });
			next();
		}
	});
};

// TODO: get all orders
exports.getAllOrders = async (req, res) => {
	Order.find()
		.populate('user', '_id, name')
		.exec((err, allOrders) => {
			if (err) {
				return res.status(500).json({ message: err });
			} else {
				res.status(200).json({
					message: 'Displaying all the orders',
					allOrders,
				});
			}
		});
};
