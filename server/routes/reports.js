const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../database');
const authenticateToken = require('../middleware/auth');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Assuming server is run from the 'server' directory
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Upload a report
router.post('/upload', authenticateToken, upload.single('report'), (req, res) => {
    const { type, date, vitals } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    db.run('INSERT INTO reports (filename, original_name, type, date, vitals, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [req.file.filename, req.file.originalname, type, date, vitals, req.user.id], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Upload failed' });
            }

            // Parse vitals and insert into vitals table for trending
            if (vitals) {
                try {
                    const vitalsObj = JSON.parse(vitals);
                    const stmt = db.prepare('INSERT INTO vitals (user_id, type, value, date) VALUES (?, ?, ?, ?)');

                    if (vitalsObj.bp) stmt.run(req.user.id, 'BP', vitalsObj.bp, date);
                    if (vitalsObj.sugar) stmt.run(req.user.id, 'Sugar', vitalsObj.sugar, date);
                    if (vitalsObj.heartRate) stmt.run(req.user.id, 'HeartRate', vitalsObj.heartRate, date);

                    stmt.finalize();
                } catch (e) {
                    console.error('Error parsing vitals:', e);
                }
            }

            res.status(201).json({ message: 'Report uploaded', reportId: this.lastID });
        });
});

// Get all reports for the user
router.get('/', authenticateToken, (req, res) => {
    const { type, date } = req.query;
    let query = 'SELECT * FROM reports WHERE user_id = ?';
    let params = [req.user.id];

    if (type) {
        query += ' AND type = ?';
        params.push(type);
    }
    if (date) {
        query += ' AND date = ?';
        params.push(date);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Fetch failed' });
        res.json(rows);
    });
});

// Get a specific report file
router.get('/:id/download', authenticateToken, (req, res) => {
    const reportId = req.params.id;
    const query = `
        SELECT r.* 
        FROM reports r 
        LEFT JOIN shares s ON r.id = s.report_id 
        WHERE r.id = ? 
        AND (r.user_id = ? OR s.shared_with_email = ?)
    `;

    db.get(query, [reportId, req.user.id, req.user.username], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Report not found or unauthorized' });

        const filePath = path.join(__dirname, '../uploads', row.filename);
        res.download(filePath, row.original_name);
    });
});

module.exports = router;
