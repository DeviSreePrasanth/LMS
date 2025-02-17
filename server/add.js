const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define your User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create User model
const User = mongoose.model('User', userSchema);

async function addLibrarian() {
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash("12345", 10); // Replace with your password

    // Create a new librarian
    const newLibrarian = new User({
      email: 'evil@gmail.com',
      password: hashedPassword,
      role: 'librarian',
    });

    // Save the new librarian to the database
    await newLibrarian.save();
    console.log('Librarian added successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error adding librarian:', err);
  }
}

// Connect to the MongoDB database
mongoose.connect('mongodb+srv://dsp771122:322103310040@cluster0.wjiwhhl.mongodb.net/Library', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    addLibrarian();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
