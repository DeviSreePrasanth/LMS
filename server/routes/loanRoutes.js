const express = require('express');
const router = express.Router();
const { issueBook, getActiveLoans, returnBook, getRecentActivities } = require('../controllers/loanController');

// Loan routes
router.post('/loans', issueBook);                // POST /api/loans
router.get('/loans/active', getActiveLoans);     // GET /api/loans/active
router.put('/loans/return/:id', returnBook);     // PUT /api/loans/return/:id
router.get('/activities/recent', getRecentActivities); // GET /api/activities/recent

module.exports = router;