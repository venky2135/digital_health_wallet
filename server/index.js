const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const vitalRoutes = require('./routes/vitals');
const shareRoutes = require('./routes/shares');

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/vitals', vitalRoutes);
app.use('/api/shares', shareRoutes);

app.get('/', (req, res) => {
    res.send('Digital Health Wallet API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
