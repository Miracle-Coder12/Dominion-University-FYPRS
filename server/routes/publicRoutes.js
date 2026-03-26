const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/stats', async (req, res) => {
    try {
        const [students] = await db.query('SELECT COUNT(*) as count FROM users WHERE role_id = (SELECT id FROM roles WHERE name = "Student")');
        const [lecturers] = await db.query('SELECT COUNT(*) as count FROM users WHERE role_id = (SELECT id FROM roles WHERE name = "Lecturer")');
        const [projects] = await db.query('SELECT COUNT(*) as count FROM projects');
        const [departments] = await db.query('SELECT COUNT(*) as count FROM departments');

        res.json({
            students: students[0].count,
            lecturers: lecturers[0].count,
            projects: projects[0].count,
            departments: departments[0].count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
