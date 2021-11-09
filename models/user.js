const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxLength: 20,
		},
		lastName: {
			type: String,
			trim: true,
			maxLength: 20,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		privatePassword: {
			type: String,
		},
		salt: {
			type: String,
		},
		userInfo: {
			type: String,
			trim: true,
		},
		role: {
			type: Number,
			default: 0,
		},
		purchases: {
			type: Array,
			trim: true,
			default: [],
		},
	},
	{ timestamps: true }
);

userSchema
	.virtual('password')
	.set(function (password) {
		password = String(password);
		// we actually refer to the virtual password here
		// to make it look private we call it as _password
		this._password = password;
		this.salt = uuidv4();
		this.privatePassword = this.encryptPassword(password);
	})
	.get(function () {
		this._password;
	});

userSchema.methods = {
	authenticatePassword: function (password) {
		return this.encryptPassword(password) === this.privatePassword;
	},
	encryptPassword: function (plainPassword) {
		if (!plainPassword) return '';

		try {
			return crypto
				.createHmac('sha256', this.salt)
				.update(plainPassword)
				.digest('hex');
		} catch (error) {
			console.log('error', error);
		}
	},
};

// userSchema.plugin(require('mongoose-beautiful-unique-validation'));

module.exports = mongoose.model('User', userSchema);
