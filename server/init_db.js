const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function initDb() {
    let connection;
    try {
        // Connect without database selected to create it if needed
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        console.log('Connected to MySQL server.');

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database '${process.env.DB_NAME}' created or already exists.`);

        await connection.changeUser({ database: process.env.DB_NAME });

        // Create Roles Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255)
      )
    `);
        console.log('Roles table ready.');

        // Insert Default Roles if empty
        const [roles] = await connection.query('SELECT * FROM roles');
        if (roles.length === 0) {
            await connection.query(`
        INSERT INTO roles (name, description) VALUES 
        ('Admin', 'System Administrator'),
        ('Student', 'University Student'),
        ('Supervisor', 'Project Supervisor'),
        ('Coordinator', 'Project Coordinator')
      `);
            console.log('Default roles inserted.');
        }

        // Create Departments Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        code VARCHAR(20) NOT NULL UNIQUE
      )
    `);
        console.log('Departments table ready.');

        // Insert Default Departments if empty
        const [depts] = await connection.query('SELECT * FROM departments');
        if (depts.length === 0) {
            await connection.query(`
        INSERT INTO departments (name, code) VALUES 
        ('Computer Science', 'CS'),
        ('Information Technology', 'IT'),
        ('Software Engineering', 'SE')
      `);
            console.log('Default departments inserted.');
        }

        // Create Users Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role_id INT,
        department_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (department_id) REFERENCES departments(id)
      )
    `);
        console.log('Users table ready.');

        console.log('Database initialization completed successfully.');

    } catch (error) {
        console.error('Database initialization failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

initDb();
