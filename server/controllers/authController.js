const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
    // Simple register for testing if needed, or manual insert
    const { username, email, password, role_id, department_id, full_name, matric_number } = req.body;

    try {
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (username, email, password_hash, role_id, department_id, full_name, matric_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, role_id, department_id, full_name, matric_number]
        );

        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query(
            `SELECT u.*, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ?`,
            [email]
        );

        if (users.length === 0) {
            console.log('User not found for email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        console.log('User found:', { id: user.id, email: user.email, hash: user.password_hash });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.status !== 'Active') {
            return res.status(403).json({ message: 'Account is not active' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role_name, department_id: user.department_id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Send HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 2 * 60 * 60 * 1000 // 2 hours
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role_name,
                status: user.status,
                department_id: user.department_id
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

exports.getCurrentUser = (req, res) => {
    // req.user is populated by verifyToken
    res.json({ user: req.user });
};
