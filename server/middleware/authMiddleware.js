const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
    return next();
};

const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

const auditLogger = (action) => async (req, res, next) => {
    const db = require('../config/db');
    const userId = req.user?.id;
    const details = `${req.method} ${req.originalUrl}`;
    const ip = req.ip;

    try {
        await db.query(
            'INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [userId || null, action, details, ip]
        );
    } catch (err) {
        console.error('Audit log failed:', err);
    }
    next();
};

module.exports = { verifyToken, checkRole, isAdmin, auditLogger };
