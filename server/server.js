const express = require('express');
console.log('Server.js starting...');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both Vite ports
    credentials: true
}));
app.use(cookieParser());

const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/reading', require('./routes/readingRoutes')); // Phase 3 Reading Features
app.use('/api/admin', require('./routes/adminRoutes')); // Phase 4 Admin Features
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Dominion University API is running');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
