import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import cors from 'cors';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import cookieParser from 'cookie-parser';
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
app.use(cookieParser());
app.use(
	session({
		secret: process.env.AWS_ACCESS_KEY, // a secret key use to encrypt the session cookie
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 1000 * 60 * 24,
		}, // set the session cookie properties
	})
);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({ extended: true }));

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
			bcrypt.hash(password, saltRound, async (err, hash) => {
				await db.query(
					'INSERT INTO users(email,name,password) VALUES ($1, $2, $3)',
					[email, name, hash]
				);
			});
			return res.json({ Signup: true });
		}
	} catch (err) {
		console.error(err);
		return res.json({ Message: 'Server Error' });
	}
});

// Loging in reout
app.post('/login', async (req, res) => {
	const email = req.body.email;
	const loginPassword = req.body.password;

	try {
		const result = await db.query('SELECT * FROM users WHERE email = $1', [
			email,
		]);

		if (result.rows.length > 0) {
			const user = result.rows[0];
			const dbPassword = user.password;
			bcrypt.compare(loginPassword, dbPassword, (err, result) => {
				// if (loginPassword == dbPassword) {
				req.session.username = user.name;
				if (result) {
					return res.json({ Login: true });
				} else {
					return res.json({ errMessage: true });
				}
			});
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
