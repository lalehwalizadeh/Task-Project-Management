import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.mjs';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

const router = express.Router();
const saltRound = 10;

// JWT token generator
const generateToken = (user) => {
	return jwt.sign(
		{ id: user.id, email: user.email, name: user.name },
		process.env.AWS_ACCESS_KEY_ID,
		{ expiresIn: '48h' }
	);
};
// middleware to check if user is authenticated
const checkAuth = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	try {
		const decoded = jwt.verify(token, process.env.AWS_ACCESS_KEY_ID);
		req.user = decoded;
		next(); // Proced to the next middleware or route handler
	} catch (err) {
		res.status(401).json({ message: 'Invalid token' });
	}
};

// routr to get user dashboard info
router.get('/dashboard', checkAuth, (req, res) => {
	
		return res.json({
			valid: true, // user is authenticated
			username: req.user.name,
			email: req.user.email,
			userId: req.user.id,
		});

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
				//Generate JWT token
				const token = generateToken(user);
				//save user in session
				req.session.user = {
					id: user.id,
					name: user.name,
					email: user.email,
				};
			
				//set cookie
				res.cookie('token', token);
				req.session.save((err) => {
					if (err) {
						console.log('session save err', err);
						return res.status(500).json({ message: 'Session Error' });
					}
				});
				// successful login
				return res.json({
					Login: true,
					user: { id: user.id, name: user.name, email: user.email },
				});
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
		//remove cookie
		res.clearCookie('token')
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
