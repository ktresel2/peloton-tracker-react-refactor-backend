const mongoose = require('mongoose')

const rideSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
	},
	instructor: {
		type: String,
		required: true,
	},
	duration: {
		type: Number,
		required: true,
	},
	mileage: {
		type: Number,
		required: true,
	},
	output: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
	},
})

module.exports = mongoose.model('Ride', rideSchema)
