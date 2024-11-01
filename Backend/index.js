import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import env from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import db from './db.mjs';

env.config();
const app = express();
const PORT = process.env.PORT || 5000;


// Middlewares
app.use(express.json());

app.use(
	cors({
		origin: ['https://task-project-management.vercel.app'],
		methods: ['POST', 'GET', 'DELETE', 'PUT', 'PATCH'],
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(
	session({
		secret: process.env.AWS_ACCESS_KEY_ID,
		resave: false,
		saveUninitialized: false,
		proxy: true,
		cookie: {
			secure: true,
			sameSite: 'none',
			maxAge: 48 * 60 * 60 *1000, // 48 hours
			domain: 'https://task-project-management.vercel.app',
			httpOnly:true,
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
