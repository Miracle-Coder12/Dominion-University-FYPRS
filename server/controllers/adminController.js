const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT u.id, u.username, u.email, u.status, u.created_at, r.name as role_name, d.name as department_name
            FROM users u
            JOIN roles r ON u.role_id = r.id
            JOIN departments d ON u.department_id = d.id
            ORDER BY u.created_at DESC
        `);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

exports.updateUserStatus = async (req, res) => {
    const { userId, status } = req.body;

    if (!['Active', 'Pending', 'Suspended'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        await db.query('UPDATE users SET status = ? WHERE id = ?', [status, userId]);

        // Log the action
        await db.query(
            'INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)',
            [req.user.id, 'USER_STATUS_CHANGE', `Changed user ${userId} status to ${status}`]
        );

        res.json({ message: 'User status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating user status' });
    }
};

exports.getSystemStats = async (req, res) => {
    try {
        const [totalProjects] = await db.query('SELECT COUNT(*) as count FROM projects');
        const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM users');
        const [totalAnnotations] = await db.query('SELECT COUNT(*) as count FROM annotations');

        const [deptStats] = await db.query(`
            SELECT d.name as department, COUNT(p.id) as count 
            FROM departments d 
            LEFT JOIN projects p ON d.id = p.department_id 
            GROUP BY d.id
        `);

        res.json({
            summary: {
                projects: totalProjects[0].count,
                users: totalUsers[0].count,
                annotations: totalAnnotations[0].count
            },
            departmentDistribution: deptStats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};

exports.getAuditLogs = async (req, res) => {
    try {
        const [logs] = await db.query(`
            SELECT al.*, u.username 
            FROM audit_logs al 
            JOIN users u ON al.user_id = u.id 
            ORDER BY al.created_at DESC 
            LIMIT 100
        `);
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching logs' });
    }
};
