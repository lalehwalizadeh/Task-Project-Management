import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.mjs';

const router = express.Router();
const saltRound = 10;

// middleware to check if user is authenticated
const checkAuth = (req, res, next) => {
	if (!req.session.user || !req.session) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	next(); // Proced to the next middleware or route handler
};

// routr to get user dashboard info
router.get('/dashboard', checkAuth, (req, res) => {
	if (req.session.user && req.session) {
		return res.json({
			valid: true, // user is authenticated
			username: req.session.user.name,
			email: req.session.user.email,
			userId: req.session.user.id,
		});
	} else {
		return res.json({ valid: false });
	}
});

// Route to check if the user is saved in the session
router.get('/check-session', (req, res) => {
	if (req.session.user) {
		return res.json({ session: true, user: req.session.user });
	} else {
		return res.json({ session: false });
	}
});
//user registration route
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

//user Login route
router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	// check if the user is exists in database
	try {
		const result = await db.query('SELECT * FROM users WHERE email = $1', [
			email,
		]);

		if (result.rows.length > 0) {
			const user = result.rows[0]; // get the user data
			const isMatch = await bcrypt.compare(password, user.password);
			console.log('is there any user in session?', req.session.user);
			// sava user information to session
			if (isMatch) {
				req.session.user = {
					id: user.id,
					name: user.name,
					email: user.email,
				};
				req.session.save((err) => {
					if (err) {
						console.log('session save err', err);
						return res.status(500).json({ message: 'Session Error' });
					}
				});
				// successful login
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

// Logout route
router.get('/logout', (req, res) => {
	// Destroy the session after logout
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
