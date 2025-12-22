const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function patchAdmin() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database.');

        // Get first department ID
        const [depts] = await connection.query('SELECT id FROM departments LIMIT 1');
        if (depts.length === 0) {
            console.log('No departments found to assign.');
            return;
        }
        const deptId = depts[0].id;

        // Update Admin (id 1 usually) or by email
        const [result] = await connection.query(
            "UPDATE users SET department_id = ? WHERE email = 'admin@dominion.edu'",
            [deptId]
        );

        console.log('Update Result:', result);
        console.log(`Admin assigned to department ID: ${deptId}`);

    } catch (error) {
        console.error('Error patching admin:', error);
    } finally {
        if (connection) await connection.end();
    }
}

patchAdmin();
