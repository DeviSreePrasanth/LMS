const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bid: { // Kept as bid, assuming it’s a Number or String matching Book.bid
    type: Number, // or String, depending on your data
    required: true,
  },
  title: { // Keeping this for now, though it’s redundant with Book
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Loan', loanSchema);