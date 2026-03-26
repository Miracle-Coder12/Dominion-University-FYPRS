const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

async function updateDbPhase4() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database.');

        // 1. Create Audit Logs Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                action VARCHAR(100) NOT NULL,
                details TEXT,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log('Audit logs table ready.');

        // 2. Add Full-Text Index for search (MySQL 5.6+ supports FULLTEXT on InnoDB)
        try {
            await connection.query('CREATE FULLTEXT INDEX idx_project_search ON projects(title, description)');
            console.log('Full-text index added to projects table.');
        } catch (err) {
            if (err.code === 'ER_DUP_KEYNAME') {
                console.log('Search index already exists.');
            } else {
                console.warn('Full-text index creation failed (might not be supported or already exists). Using regular index for title.');
                await connection.query('CREATE INDEX idx_project_title ON projects(title)');
            }
        }

        // 3. Add index on created_at for sorting
        try {
            await connection.query('CREATE INDEX idx_project_created ON projects(created_at)');
            console.log('Sorting index added to projects table.');
        } catch (err) {
            if (err.code === 'ER_DUP_KEYNAME') console.log('Created_at index already exists.');
        }

        console.log('Database update for Phase 4 completed.');

    } catch (error) {
        console.error('Error updating DB for Phase 4:', error);
    } finally {
        if (connection) await connection.end();
    }
}

updateDbPhase4();
