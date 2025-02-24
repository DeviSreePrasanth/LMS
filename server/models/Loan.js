const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Reference to Student model
    required: true,
  },
  bid: {
    type: String,
    required: true, // Book ID
  },
  title: {
    type: String,
    required: true, // Book title
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true, // Add due date for each loan
  },
  returnDate: {
    type: Date,
    default: null, // Null if not returned
  },
});

module.exports = mongoose.model('Loan', loanSchema);