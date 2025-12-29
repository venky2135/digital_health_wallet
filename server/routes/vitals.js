const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');

// Add a vital reading
router.post('/', authenticateToken, (req, res) => {
    const { type, value, date } = req.body;
    if (!type || !value || !date) {
        return res.status(400).json({ error: 'Type, value, and date are required' });
    }

    db.run('INSERT INTO vitals (user_id, type, value, date) VALUES (?, ?, ?, ?)',
        [req.user.id, type, value, date], function (err) {
            if (err) return res.status(500).json({ error: 'Failed to add vital' });
            res.status(201).json({ message: 'Vital added', vitalId: this.lastID });
        });
});

// Get vitals history
router.get('/', authenticateToken, (req, res) => {
    const { type, startDate, endDate } = req.query;
    let query = 'SELECT * FROM vitals WHERE user_id = ?';
    let params = [req.user.id];

    if (type) {
        query += ' AND type = ?';
        params.push(type);
    }
    if (startDate) {
        query += ' AND date >= ?';
        params.push(startDate);
    }
    if (endDate) {
        query += ' AND date <= ?';
        params.push(endDate);
    }

    query += ' ORDER BY date ASC';

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Fetch failed' });
        res.json(rows);
    });
});

module.exports = router;
