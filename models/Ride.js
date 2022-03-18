const mongoose = require('mongoose')

const rideSchema = new mongoose.Schema({
	instructor: {
		type: String,
		required: true,
	},
	length: {
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
