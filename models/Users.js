const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	user: {
		type: String,
		require: true,
	},
	first_name: {
		type: String,
		require: true
	},
	last_name: {
		type: String,
		require: true,
	},
	password: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true,
	},
	country: {
		type: String,
		require: true,
	},
	avatar: {
		type: String,
		require: false,
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Users = mongoose.model('users', UserSchema);
