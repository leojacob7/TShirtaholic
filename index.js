require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const signUpRoute = require('./routes/auth');
const usersRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const productsRoute = require('./routes/product');
const orderRoute = require('./routes/order');

const app = express();

const PORT = process.env.BACKENDPORT || 3000;

mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('🚀🚀 DB CONNECTED');
	})
	.catch((err) => console.log('⚠️ ⛔️ OOPS an error occured', err));

const login = true;
const isLoggedIn = (req, res, next) => {
	console.log('login :>> ', login);
	if (login) {
		console.log('Yes Logged in');
		next();
	} else {
		console.log('No not logged in');
		res.json('Cant redirect to login page');
	}
};

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use('/api', signUpRoute);
app.use('/api', usersRoute);
app.use('/api', categoryRoute);
app.use('/api', productsRoute);
app.use('/api', orderRoute);
app.use('*', (req, res) => res.json({ message: '404 page not found' }));

app.listen(PORT, () => console.log(`Up and running at port: ${PORT}`));
