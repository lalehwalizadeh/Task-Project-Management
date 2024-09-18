
import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 8081;
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));


const pool = new Pool({
    host: "localhost",
    user: 'postgres', 
    password: '', 
    database: 'TaskManagement',
    port: PORT
});

app.get('/', (req, res) => {
    res.send('Hello')
})
app.post('/signup', async (req, res) => {
    const sql = "INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];
    
    try {
        const result = await pool.query(sql, values);
        return res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(400).json('Error');
    }
});

app.post('/login', async (req, res) => {
    const sql = 'SELECT * FROM TaskManagement WHERE email = $1 AND password = $2';
    
    try {
        const result = await pool.query(sql, [req.body.email, req.body.password]);
        
        if (result.rows.length > 0) {
            return res.json("Success");
        } else {
            return res.json("Failed");
        }
    } catch (err) {
        console.error(err);
        return res.status(404).json('Error');
    }
});

app.listen(PORT, () => {
    console.log("listening to port 8081");
});

