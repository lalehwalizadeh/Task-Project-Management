import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.mjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const saltRound = 10;
const JWT_SECRET = process.env.AWS_ACCESS_KEY_ID; 


const checkAuth = (req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.userData = decoded;
            return next();
        }
        
        if (!req.session.user || !req.session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Auth failed' });
    }
};

router.get('/dashboard', checkAuth, (req, res) => {
    if (req.userData) { 
        return res.json({
            valid: true,
            username: req.userData.name,
            email: req.userData.email,
            userId: req.userData.userId,
        });
    } else if (req.session.user && req.session) { 
        return res.json({
            valid: true,
            username: req.session.user.name,
            email: req.session.user.email,
            userId: req.session.user.id,
        });
    } else {
        return res.json({ valid: false });
    }
});


router.get('/check-session', (req, res) => {
    if (req.session.user) {
        return res.json({ session: true, user: req.session.user });
    } else {
        return res.json({ session: false });
    }
});


router.post('/signup', async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const checkAuth = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (checkAuth.rows.length > 0) {
            return res.json({ Signup: false });
        } else {
            const hash = await bcrypt.hash(password, saltRound);
            const result = await db.query(
                'INSERT INTO users(email, name, password) VALUES ($1, $2, $3) RETURNING id',
                [email, name, hash]
            );

            const token = jwt.sign(
                { userId: result.rows[0].id, email, name },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.json({ 
                Signup: true,
                token,
                user: { id: result.rows[0].id, email, name }
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ Message: 'Server Error' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
               
                const token = jwt.sign(
                    { userId: user.id, email: user.email, name: user.name },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

               
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

                return res.json({ 
                    Login: true,
                    token,
                    user: { id: user.id, name: user.name, email: user.email }
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


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.json({ Logout: false });
        }
        res.json({ Logout: true });
    });
});


router.delete('/delete-account', checkAuth, async (req, res) => {
    const userEmail = req.userData ? req.userData.email : req.session.user.email;
    
    if (!userEmail) {
        return res.json({ message: 'Unauthorized' });
    }

    try {
        await db.query('DELETE FROM users WHERE email = $1', [userEmail]);

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