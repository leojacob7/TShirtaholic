const mongoose = require('mongoose');
const category = require('./category');
const Schema = mongoose.Schema;

const ProductSchema = mongoose.Schema(
	{
		name: {
			type: String,
			maxLength: 32,
			trim: true,
			required: true,
		},
		description: {
			type: String,
			maxLength: 2000,
			trim: true,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: category,
			required: true,
		},
		stocks: {
			type: Number,
		},
		sold: {
			type: Number,
			default: 0,
		},
		photo: {
			data: Buffer,
			contentType: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Product', ProductSchema);
