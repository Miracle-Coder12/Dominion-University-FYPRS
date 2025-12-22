const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        // Check if admin exists
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', ['admin']);
        if (users.length > 0) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        // Get Admin Role ID & Dept ID (assuming IDs 1 for now or fetch)
        const [roles] = await db.query('SELECT id FROM roles WHERE name = "Admin"');
        const roleId = roles[0].id;

        // Get a dept
        const [depts] = await db.query('SELECT id FROM departments LIMIT 1');
        const deptId = depts[0].id;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        await db.query(
            'INSERT INTO users (username, email, password_hash, role_id, department_id) VALUES (?, ?, ?, ?, ?)',
            ['admin', 'admin@dominion.edu', hashedPassword, roleId, deptId]
        );

        console.log('Admin user created successfully. Email: admin@dominion.edu, Pass: password123');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createAdmin();
