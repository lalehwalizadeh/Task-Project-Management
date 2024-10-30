import express from 'express';
import db from '../db.mjs';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const router = express.Router();

const checkAuth = (req, res, next) => {
	if (!req.session.user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	next();
};
// upload and display img:

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the uploads directory outside of the routrs folder
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		return cb(null, uploadsDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const fileExtension = path.extname(file.originalname);
		return cb(null, uniqueSuffix + fileExtension);
	},
});
const upload = multer({ storage });
router.use('/uploads', express.static(uploadsDir));

// difine routes:
router.get('/tasks', checkAuth, async (req, res) => {
	try {
		const userId = req.session.user.id;
		const result = await db.query('SELECT * FROM tasks WHERE user_id = $1', [
			userId,
		]);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

router.post(
	'/submit/task',
	checkAuth,
	upload.single('file'),
	async (req, res) => {
		try {
			const { name, date, type, description } = req.body;
			const userId = req.session.user.id;
			const imageUrl = req.file
				? '../uploads/' + req.file.filename
				: '../uploads/placeholder.jpg';

			await db.query(
				'INSERT INTO tasks(title, description, image, type, due_date,user_id) VALUES ($1, $2, $3, $4, $5,$6)',
				[name, description, imageUrl, type, date, userId]
			);
			res.sendStatus(201);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
		}
	}
);
router.get('/task/:id',checkAuth, async (req, res) => {
	const { id } = req.params;
	const userId = req.session.user.id;
	try {
		const result = await db.query(
			'SELECT* FROM tasks WHERE id = $1 AND user_id =$2',
			[id, userId]
		);
		if (result.rows.length > 0) {
			res.json(result.rows[0]);
		} else {
			res.status(404).json({ message: 'Task not found!' });

		}
	} catch (err) {
		console.log(err);
	}
});

// updating task
router.patch('/update/:id',checkAuth, upload.single('file'), async (req, res) => {
	const { id } = req.params;
	const { name, date, type, description } = req.body;
	try {
		const imageUrl = req.file ? '../uploads/' + req.file.filename : null; //keep existing image if no new file is uploaded
		await db.query(
			`UPDATE tasks SET title = $1,description =$2,type=$3,due_date=$4,image =COALESCE($5,image)WHERE id = $6`,
			[name, description, type, date, imageUrl, id]
		);
		res.status(200).json({ message: 'task updated!' });
	} catch {
		(err) => {
			console.log(err);
		};
	}
});

// Deleting task

router.delete('/delete/task/:id', async (req, res) => {
	const { id } = req.params;
	await db.query('DELETE FROM tasks WHERE id = $1', [id]);
	res.json({ delete: true });
});

export default router;
