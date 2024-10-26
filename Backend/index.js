import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import env from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js'
import db from './db.mjs';

env.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
	cors({
		origin: ['http://localhost:3000'],
		methods: ['POST', 'GET', 'DELETE', 'PUT','PATCH'],
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	session({
		secret: process.env.AWS_ACCESS_KEY,
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false,
			maxAge: 1000 * 60 * 60 * 60 * 24,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);
app.use('/', taskRoutes);

app.listen(PORT, () => {
	console.log('Server started on port', PORT);
});
