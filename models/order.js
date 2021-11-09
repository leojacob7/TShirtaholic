const mongoose = require('mongoose');
const ObjectId = mongoose.Schema;
const Schema = mongoose.Schema;

const ProductCartSchema = Schema(
	{
		product: { type: Schema.Types.ObjectId, ref: 'Product' },
		count: Number,
		name: String,
		price: Number,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('ProductCart', ProductCartSchema);

const OrderSchema = Schema(
	{
		products: { type: [ProductCartSchema], required: true },
		transactionId: {
			type: String,
			required: true,
			maxLength: 32,
		},
		status: {
			type: String,
			default: 'Received',
			enums: ['Received', 'Completed', 'Processing'],
		},
		amount: { type: Number },
		address: { type: String },
		lastUpdated: Date,
		user: { type: Schema.Types.ObjectId, ref: 'User' },
	},
	{
		timestamps: true,
	}
);
module.exports = mongoose.model('Order', OrderSchema);
