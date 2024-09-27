
import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import cors from 'cors';


const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
	user: process.env.USER,
	host: process.env.HOST,
	database: process.env.DATABASE,
	password: process.env.PASSWORD,
	port: 5432,
});

const pool = new Pool({
    user: 'your_db_user',
    host: 'localhost',
    database: 'your_db_name',
    password: 'your_db_password',
    port: 5432,
});


app.get('/tasks', async (req, res) => {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
});

app.post('/tasks', upload.single('image'), async (req, res) => {
    const { name, date, type, description } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    await pool.query('INSERT INTO tasks (name, date, type, description, image_url) VALUES ($1, $2, $3, $4, $5)', [name, date, type, description, imageUrl]);
    res.sendStatus(201);
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});