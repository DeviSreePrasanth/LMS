// Import required modules
require('dotenv').config();
const mongoose = require('mongoose');
const csvtojson = require('csvtojson');
const path = require('path');
const Book = require('./models/Book');

// MongoDB Atlas Connection using .env
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Convert CSV to JSON and Push to MongoDB
const csvFilePath = path.join(__dirname, 'books.csv');
csvtojson()
  .fromFile(csvFilePath)
  .then((jsonArray) => {
    // Clear existing collection (Optional)
    Book.deleteMany({})
      .then(() => {
        console.log('Old data cleared.');
        // Insert new data
        Book.insertMany(jsonArray)
          .then(() => {
            console.log('Books data successfully uploaded to MongoDB Atlas!');
            mongoose.connection.close();
          })
          .catch((error) => {
            console.error('Error uploading data:', error);
          });
      })
      .catch((error) => {
        console.error('Error clearing old data:', error);
      });
  }).catch((error) => {
    console.error('Error converting CSV to JSON:', error);
  });
