import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import env from 'dotenv';
import router from './routes/authRoutes';
import db from './db';

env.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
	cors({
		origin: ['http://localhost:3000'],
		methods: ['POST', 'GET', 'DELETE', 'PUT'],
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
			maxAge: 1000 * 60 * 60 * 24,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);


app.listen(PORT, () => {
	console.log('Server started on port', PORT);
});