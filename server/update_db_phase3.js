const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function updateDb() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database.');

        // 1. Create UserReadingProgress Table
        // Using TIMESTAMP for updated_at with basic compatibility
        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_reading_progress (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                project_id INT NOT NULL,
                version_id INT NOT NULL,
                last_page INT DEFAULT 1,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY user_project_version (user_id, project_id, version_id)
            ) ENGINE=InnoDB
        `);
        console.log('UserReadingProgress table ready.');

        // 2. Create Annotations Table
        // Using TEXT instead of JSON for position_data
        await connection.query(`
            CREATE TABLE IF NOT EXISTS annotations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                version_id INT NOT NULL,
                page_number INT NOT NULL,
                color VARCHAR(20) NOT NULL,
                type VARCHAR(20) DEFAULT 'highlight',
                position_data TEXT NOT NULL,
                content TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `);
        console.log('Annotations table ready.');

        // 3. Create AnnotationComments Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS annotation_comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                annotation_id INT NOT NULL,
                user_id INT NOT NULL,
                comment_text TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `);
        console.log('AnnotationComments table ready.');

        console.log('Database update for Phase 3 completed successfully (Compatibility Mode).');

    } catch (error) {
        console.error('Database update failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

updateDb();
