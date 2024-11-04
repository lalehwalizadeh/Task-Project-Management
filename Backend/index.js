import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'passport';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import env from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import db from './db.mjs';

// Load environmet variables form .env file
env.config();
// initialize Express application
const app = express();
//set port from environmet variables or default to 5000
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// CORS middleware to allow cross-origin requests
app.use(
	cors({
		origin: ['https://task-project-management.vercel.app'],
		methods: ['POST', 'GET', 'DELETE', 'PUT', 'PATCH'],
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
);

app.use(bodyParser.urlencoded({ extended: true }));
// middleware to parse cookies
app.use(cookieParser());

// Session configuration
app.use(
	session({
		secret: process.env.AWS_ACCESS_KEY_ID,
		resave: false,
		saveUninitialized: false,
		proxy: true,
		cookie: {
			secure: true,
			sameSite: 'none',
			maxAge: 48 * 60 * 60 * 1000, // 48 hours
			domain: 'https://task-project-management.vercel.app',
			httpOnly: true,
		},
	})
);
// initialize passport for authentication
app.use(passport.initialize());
// use session for authentication state
app.use(passport.session());
// define routes for authentication and tasks
app.use('/', authRoutes);
app.use('/', taskRoutes);

// start server and listen on the port
app.listen(PORT, () => {
	console.log('Server started on port', PORT);
});
