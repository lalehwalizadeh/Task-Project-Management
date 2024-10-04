import express from 'express';
import db from '../db.mjs';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const router = express.Router();

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
router.get('/tasks', async (req, res) => {
	const result = await db.query('SELECT * FROM tasks');
	res.json(result.rows);
});

router.post('/submit/task', upload.single('file'), async (req, res) => {
	console.log('form information:', req.body);
	console.log('picture:', req.file);

	try {
		const { name, date, type, description } = req.body;

		const imageUrl = req.file
			? '../uploads/' + req.file.filename
			: '../uploads/placeholder.jpg';

		await db.query(
			'INSERT INTO tasks(title, description, image, type, due_date) VALUES ($1, $2, $3, $4, $5)',
			[name, description, imageUrl, type, date]
		);
		res.sendStatus(201);
	} catch (err) {
		console.error(err);
	}
});

// Deleting task

router.delete('/delete/task/:id', async (req, res) => {
	const { id } = req.params;
	await db.query('DELETE FROM tasks WHERE id = $1', [id]);
	res.json({ delete: true });
});

export default router;
