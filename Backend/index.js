import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import cors from 'cors';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
	origin: ["http://localhost:3000"],
	methods: ["POST", "GET"],
	credentials: true

}));
app.use(cookieParser());
app.use(
	session({
		secret: 'secret', // a secret key use to encrypt the session cookie
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
	user: 'postgres',
	host: 'localhost',
	database: 'TaskManagement',
	password: 'postgres',
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
// Sign Up rout:
app.post('/signup', async (req, res) => {
	const { name, email, password } = req.body;
	const values = [name, email, password];

	try {
		const checkAuth = await db.query('SELECT * FROM users WHERE email = $1', [
			email,
		]);

		if (checkAuth.rows.length > 0) {
			return res.json({ Signup: false });
		} else {
			await db.query(
				'INSERT INTO users(email,name,password) VALUES ($1, $2, $3)',
				values
			);
			return res.json({ Signup: true });
		}
	} catch (err) {
		console.error(err);
		return res.json({ Message: 'Server Error' });
	}
});

app.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const result = await db.query('SELECT * FROM users WHERE email = $1', [
			email,
		]);

		if (result.rows.length > 0) {
			const user = result.rows[0];
			const storedPassword = user.password;

			if (password === storedPassword) {
				req.session.username = user.name;
				console.log(req.session.username);

				return res.json({ Login: true });
			} else {
				return res.json({errMessage: true});
			}
		} else {
			return res.json({ Login: false });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({Message:"Server Error"})
	}
});

app.listen(PORT, () => {
	console.log('sever started on port', PORT);
});
