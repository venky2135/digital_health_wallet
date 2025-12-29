const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');

// Share a report
router.post('/share', authenticateToken, (req, res) => {
    const { reportId, sharedWithEmail, permission } = req.body;

    // Verify report ownership
    db.get('SELECT * FROM reports WHERE id = ? AND user_id = ?', [reportId, req.user.id], (err, report) => {
        if (err || !report) return res.status(404).json({ error: 'Report not found or unauthorized' });

        db.run('INSERT INTO shares (report_id, owner_id, shared_with_email, permission) VALUES (?, ?, ?, ?)',
            [reportId, req.user.id, sharedWithEmail, permission || 'view'], function (err) {
                if (err) return res.status(500).json({ error: 'Share failed' });
                res.status(201).json({ message: 'Report shared' });
            });
    });
});

// Get reports shared with me
router.get('/shared-with-me', authenticateToken, (req, res) => {
    // Assuming username is the email for this simple implementation
    db.all(`
        SELECT r.*, s.permission, u.username as owner_name 
        FROM shares s
        JOIN reports r ON s.report_id = r.id
        JOIN users u ON r.user_id = u.id
        WHERE s.shared_with_email = ?
    `, [req.user.username], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Fetch failed' });
        res.json(rows);
    });
});

module.exports = router;
