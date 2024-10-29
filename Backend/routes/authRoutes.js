import express from 'express';
import bcrypt from 'bcrypt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from 'passport';
import db from '../db.mjs';

const router = express.Router();
const saltRound = 10;

router.get('/dashboard', (req, res) => {
	if (req.session.user) {
		return res.json({ valid: true, username: req.session.user.name });
	} else {
		return res.json({ valid: false });
	}
});

// Google login
router.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	})
);

router.get(
	'/auth/google/dashboard',
	passport.authenticate('google', {
		failureRedirect: '/login',
	}),
	(req, res) => {
		req.session.user = {
			// Storing user info in session
			name: req.user.displayName,
			email: req.user.emails[0].value,
		};
		res.json({ googleLogin: true }); // Redirect to dashboard after successful login
	}
);

router.get('/auth/google/dashboard',

	(req, res) => {
	if (req.session.user) {
		return res.json({ googleLogin: true });
	} else {
		return res.json({ googleLogin: false });
	}
});

// Registration
router.post('/signup', async (req, res) => {
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
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const result = await db.query('SELECT * FROM users WHERE email = $1', [
			email,
		]);

		if (result.rows.length > 0) {
			const user = result.rows[0];
			const isMatch = await bcrypt.compare(password, user.password);

			if (isMatch) {
				req.session.user = {
					name: user.name,
					email: user.email,
				};
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
			callbackURL: 'http://localhost:5000/auth/google/dashboard', // Use the correct port here
			userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
		},
		async (accessToken, refreshToken, profile, cb) => {
			try {
				console.log('google profile', profile);
				if (!profile.emails || profile.emails.length === 0) {
					return cd(new Error('no email found in'));
				}
				const email = profile.emails[0].value;
				const result = await db.query('SELECT * FROM users WHERE email = $1', [
					email,
				]);

				if (result.rows.length === 0) {
					const newUser = await db.query(
						'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *',
						[email, profile.displayName, 'google']
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
router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.log(err);
			return res.json({ Logout: false });
		}
		res.json({ Logout: true });
	});
});

// Delete account Rout:
router.delete('/delete-account', async (req, res) => {
	if (!req.session.user) {
		return res.json({ message: 'Unauthorized' });
	}
	const email = req.session.user.email;
	try {
		await db.query('DELETE FROM users WHERE email =$1', [email]);

		req.session.destroy((err) => {
			if (err) {
				console.log(err);
				return res.json({ message: 'Server Error' });
			}
			return res.json({ dltMessage: true });
		});
	} catch (err) {
		console.log(err);
		res.json({ message: 'Server Error' });
	}
});

export default router;
