const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			maxLength: 32,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Category', CategorySchema);
