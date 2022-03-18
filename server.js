const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')

const app = express()

app.use(
	cors({
		origin: '*',
	})
)

connectDB()

app.use(express.json({ extended: false }))

app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
// app.use('/api/rides', require('./routes/rides'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
