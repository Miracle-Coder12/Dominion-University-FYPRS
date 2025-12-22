const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function fixAdmin() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database.');

        const [result] = await connection.query(
            "UPDATE users SET status = 'Active' WHERE email = 'admin@dominion.edu'"
        );

        console.log('Update Result:', result);
        console.log('Admin status updated to Active.');

    } catch (error) {
        console.error('Error updating admin:', error);
    } finally {
        if (connection) await connection.end();
    }
}

fixAdmin();
