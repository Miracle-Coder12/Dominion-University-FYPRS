const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function alterDb() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database.');

        try {
            await connection.query(
                "ALTER TABLE users ADD COLUMN status ENUM('Active', 'Pending', 'Suspended') DEFAULT 'Active'"
            );
            console.log('Added status column successfully.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Column status already exists.');
            } else {
                throw err;
            }
        }

        // Also update Admin to be Active just in case
        await connection.query(
            "UPDATE users SET status = 'Active' WHERE email = 'admin@dominion.edu'"
        );
        console.log('Admin status updated.');

    } catch (error) {
        console.error('Error altering DB:', error);
    } finally {
        if (connection) await connection.end();
    }
}

alterDb();
