const mongoose = require('mongoose');

const issuedBookSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  bid: {
    type: String,
    required: true,
  },
  title: {
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

module.exports = mongoose.model('IssuedBook', issuedBookSchema);