const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  transactionDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
