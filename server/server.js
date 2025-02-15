const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/auth"); 
const transactionRoutes = require("./routes/transactions");
// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Atlas connected!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes

app.use("/api/auth", authRoutes); 
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes); // Transaction routes

// Catch-all route for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
