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
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(cookieParser());

const authRoutes = require('./routes/authRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Dominion University API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
