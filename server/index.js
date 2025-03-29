// Required dependencies
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Configure dotenv to load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection using environment variables
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Create Schema for form data
const formDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Model from Schema
const FormData = mongoose.model('FormData', formDataSchema);

// POST route to handle form submission
app.post('/api/submit-form', async (req, res) => {
  try {
    const { name, email, contactNumber, message } = req.body;
    // Validate required fields
    if (!name || !email || !contactNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    // Create new form data document
    const formData = new FormData({
      name,
      email,
      contactNumber,
      message
    });
    // Save to database
    await formData.save();
    return res.status(201).json({
      success: true,
      message: 'Form data submitted successfully',
      data: formData
    });
  } catch (error) {
    console.error('Error saving form data:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: error.message
    });
  }
});

// GET route to fetch all form submissions
app.get('/api/form-submissions', async (req, res) => {
  try {
    const submissions = await FormData.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching form data:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: error.message
    });
  }
});

// Simple route for testing server
app.get('/', (req, res) => {
  res.send('Form Submission API is running');
});

// Set port and start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});