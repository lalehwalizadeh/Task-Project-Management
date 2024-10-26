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
router.get('/task/:id', async(req, res) => {
	const { id } = req.params;
	try {
		const result = await db.query('SELECT* FROM tasks WHERE id = $1',[id])
		if (result.rows.length > 0) {
			res.json(result.rows[0]);
		} else {
			res.send('task not found!')
		}
	} catch (err) {
		console.log(err);
	}
})

// updating task
router.patch('/update/:id', upload.single('file'), async (req, res) => {
	const { id } = req.params;
	const { name, date, type, description } = req.body;
	try {
		const imageUrl = req.file ? '../uploads/' + req.file.filename : null; //keep existing image if no new file is uploaded
		await db.query(
			`UPDATE tasks SET title = $1,description =$2,type=$3,due_date=$4,image =COALESCE($5,image)WHERE id = $6`,
			[name, description, type, date, imageUrl, id]
		);
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
