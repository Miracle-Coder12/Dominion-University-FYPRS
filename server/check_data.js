const db = require('./config/db');

async function checkData() {
    try {
        const [users] = await db.query("SELECT id, username, email, department_id, status FROM users WHERE email = 'admin@dominion.edu'");
        console.log('Admin User:', users[0]);

        const [depts] = await db.query("SELECT * FROM departments");
        console.log('Departments:', depts);

    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        process.exit();
    }
}

checkData();
