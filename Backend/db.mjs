import pg from 'pg';
import env from 'dotenv';

env.config();

const db = new pg.Client({
	user: process.env.USER,
	host: process.env.HOST,
	database: process.env.DATABASE,
	password: process.env.PASSWORD,
	port: 5432,
	ssl: {
        rejectUnauthorized: true, // Set this to false for development; use true in production with a trusted certificate.
    },
}

);

db.connect();

export default db;