import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import bcrypt, { hash } from 'bcrypt';
import env from 'dotenv';

env.config();
const app = express();
const saltRound = 10;
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
	cors({
		origin: ['http://localhost:3000'],
		methods: ['POST', 'GET'],
		credentials: true,
	})
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	session({
		secret: process.env.AWS_ACCESS_KEY, // a secret key use to encrypt the session cookie
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false,
			maxAge: 1000 * 60 * 60 * 24,
		}, // set the session cookie properties
	})
);

app.use(passport.initialize());
app.use(passport.session());

// Database information
const db = new pg.Client({
	user: process.env.USER,
	host: process.env.HOST,
	database: process.env.DATABASE,
	password: process.env.PASSWORD,
	port: 5432,
});

db.connect();

app.get('/dashboard', (req, res) => {
	
	if (req.session.username) {
		return res.json({ valid: true, username: req.session.username });
	} else {
		return res.json({ valid: false });
	}
});

// Registration  rout:
app.post('/signup', async (req, res) => {
	const { email, name, password } = req.body;

	try {
		const checkAuth = await db.query('SELECT * FROM users WHERE email = $1', [
			email,
		]);

		if (checkAuth.rows.length > 0) {
			return res.json({ Signup: false });
		} else {
			const hash = await bcrypt.hash(password, saltRound);

			await db.query(
				'INSERT INTO users(email,name,password) VALUES ($1, $2, $3)',
				[email, name, hash]
			);

			return res.json({ Signup: true });
		}
	} catch (err) {
		console.error(err);
		return res.json({ Message: 'Server Error' });
	}
});

// Loging in reout
app.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const result = await db.query('SELECT * FROM users WHERE email = $1', [
			email,
		]);

		if (result.rows.length > 0) {
			const user = result.rows[0];
			const isMatch = await bcrypt.compare(password, user.password);

			if (isMatch) {
				req.session.username = user.name;
				return res.json({ Login: true });
			} else {
				return res.json({ errMessage: true });
			}
		} else {
			return res.json({ Login: false });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ Message: 'Server Error' });
	}
});

app.listen(PORT, () => {
	console.log('sever started on port', PORT);
});
