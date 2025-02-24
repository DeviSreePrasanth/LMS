const express = require('express');
const router = express.Router();
const { issueBook, getActiveLoans, returnBook } = require('../controllers/loanController');

// Loan routes
router.post('/loans', issueBook);         // POST /api/loans
router.get('/loans/active', getActiveLoans); // GET /api/loans/active
router.put('/loans/return/:id', returnBook); // PUT /api/loans/return/:id

module.exports = router;