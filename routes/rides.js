const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator')

const User = require('../models/User')
const Ride = require('../models/Ride')

require('dotenv').config()

// @route   GET api/rides
// @desc   Get all user's rides
// @access   Private
router.get('/', auth, async (req, res) => {
	try {
		const rides = await Ride.find({ user: req.user.id }).sort({
			date: -1,
		})
		res.json(rides)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

// @route   POST api/rides
// @desc   Add new ride
// @access   Private
router.post(
	'/',
	[
		auth,
		[check('instructor', 'Instructor is required').not().isEmpty()],
		[check('duration', 'Duration is required').not().isEmpty()],
		[check('mileage', 'Mileage is required').not().isEmpty()],
		[check('output', 'Output is required').not().isEmpty()],
		[check('date', 'Date is required').not().isEmpty()],
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { instructor, duration, mileage, output, date } = req.body

		try {
			const newRide = new Ride({
				instructor,
				duration,
				mileage,
				output,
				date,
				user: req.user.id,
			})

			const ride = await newRide.save()

			res.json(ride)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Server Error')
		}
	}
)

// @route   PUT api/rides/:id
// @desc   Update ride
// @access   Private
router.put('/:id', auth, async (req, res) => {
	const { instructor, duration, mileage, output, date } = req.body

	const rideFields = {}
	if (instructor) rideFields.instructor = instructor
	if (duration) rideFields.duration = duration
	if (mileage) rideFields.mileage = mileage
	if (output) rideFields.output = output
	if (date) rideFields.date = date

	try {
		let ride = await Ride.findById(req.params.id)

		if (!ride) return res.status(404).json({ msg: 'Ride not found' })

		if (ride.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorized' })
		}

		ride = await Ride.findByIdAndUpdate(
			req.params.id,
			{ $set: rideFields },
			{ new: true }
		)
		res.json(ride)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

// @route   DELETE api/rides/:id
// @desc   Delete ride
// @access   Private
router.delete('/:id', auth, async (req, res) => {
	try {
		let ride = await Ride.findById(req.params.id)

		if (!ride) return res.status(404).json({ msg: 'Ride not found' })
		if (ride.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorized' })
		}

		await Ride.findByIdAndRemove(req.params.id)
		res.json({ msg: 'Ride deleted' })
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

module.exports = router
