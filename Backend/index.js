import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import GoogleStrategy from 'passport-google-oauth2';
import env from 'dotenv';

env.config();
const app = express();
const saltRound = 10;
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
	cors({
		origin: ['http://localhost:3000'],
		methods: ['POST', 'GET','DELETE','PUT'],
		credentials: true,
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
	}
	return res.json({ valid: false });
});

// Google login
app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	})
);

app.get(
	'/auth/google/dashboard',
	passport.authenticate('google', {
		failureRedirect: '/login',
	}),
	(req, res) => {
		req.session.username = req.user.name; // Storing user info in session
    res.json({googleLogin:true}); // Redirect to dashboard after successful login
	}
);

// Registration
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
				'INSERT INTO users(email, name, password) VALUES ($1, $2, $3)',
				[email, name, hash]
			);
			return res.json({ Signup: true });
		}
	} catch (err) {
		console.error(err);
		return res.json({ Message: 'Server Error' });
	}
});

// Login
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
			}
			return res.json({ errMessage: true });
		}
		return res.json({ Login: false });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ Message: 'Server Error' });
	}
});

// Google strategy
passport.use(
	'google',
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:3000/auth/google/dashboard', // Use the correct port here
			userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
		},
		async (accessToken, refreshToken, profile, cb) => {
			console.log(profile);
			try {
				const result = await db.query('SELECT * FROM users WHERE email = $1', [
					profile.email,
				]);
				if (result.rows.length === 0) {
					const newUser = await db.query(
						'INSERT INTO users (email, name, password) VALUES ($1, $2, $3)',
						[profile.email,profile.displayName, 'google']
					);
					return cb(null, newUser.rows[0]);
				} else {
					return cb(null, result.rows[0]);
				}
			} catch (err) {
				return cb(err);
			}
		}
	)
);

passport.serializeUser((user, cb) => {
	cb(null, user);
});

// Logout route
app.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.log(err);
			return res.json({ Logout: false });
		}
		res.json({ Logout: true });
	});
});

// Delete account Rout:
app.delete('/delete-account', async (req, res) => {
	if (!req.session.username) {
	  console.log('user not authenticated');
    return res.json({ message: 'Unauthorized' });
  }
  const email = req.session.username;
  try {
	  await db.query('DELETE FROM users WHERE email =$1', [email]);
    req.session.destroy(err => {
      if (err) {
        console.log(err);
        return res.json({ message: 'Server Error' });
      }
		return res.json({ dltMessage: true });
    });
  } catch (err) {
    console.log(err);
    res.json({message:'Server Error'})
  }
})


app.listen(PORT, () => {
	console.log('Server started on port', PORT);
});
