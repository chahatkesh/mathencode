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
  countryCode: {
    type: String,
    required: false,
    default: "+1"
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

// Create Model from Schema
const FormData = mongoose.model('FormData', formDataSchema);

// Create Schema for tutor applications
const tutorApplicationSchema = new mongoose.Schema({
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
  subject: {
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
  },
  isRead: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected'],
    default: 'pending'
  }
});

// Create Model for tutor applications
const TutorApplication = mongoose.model('TutorApplication', tutorApplicationSchema);

// POST route to handle form submission
app.post('/api/submit-form', async (req, res) => {
  try {
    const { name, email, contactNumber, countryCode, message } = req.body;
    if (!name || !email || !contactNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    const formData = new FormData({
      name,
      email,
      contactNumber,
      countryCode: countryCode || "+1", // Default to +1 if not provided
      message,
      isRead: false // Default value
    });
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

// New PATCH route to toggle read status
app.patch('/api/form-submissions/:id/read', async (req, res) => {
  try {
    const submission = await FormData.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    submission.isRead = !submission.isRead;
    await submission.save();

    return res.status(200).json({
      success: true,
      message: 'Read status updated',
      data: submission
    });
  } catch (error) {
    console.error('Error updating read status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: error.message
    });
  }
});

// POST route to handle tutor application submission
app.post('/api/submit-tutor-application', async (req, res) => {
  try {
    const { name, email, contactNumber, subject, message } = req.body;
    if (!name || !email || !contactNumber || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    const tutorApplication = new TutorApplication({
      name,
      email,
      contactNumber,
      subject,
      message,
      isRead: false,
      status: 'pending'
    });
    
    await tutorApplication.save();
    
    return res.status(201).json({
      success: true,
      message: 'Tutor application submitted successfully',
      data: tutorApplication
    });
  } catch (error) {
    console.error('Error saving tutor application:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: error.message
    });
  }
});

// GET route to fetch all tutor applications
app.get('/api/tutor-applications', async (req, res) => {
  try {
    const applications = await TutorApplication.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching tutor applications:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: error.message
    });
  }
});

// PATCH route to update tutor application status
app.patch('/api/tutor-applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const application = await TutorApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: 'Application status updated',
      data: application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: error.message
    });
  }
});

// PATCH route to toggle read status for tutor applications
app.patch('/api/tutor-applications/:id/read', async (req, res) => {
  try {
    const application = await TutorApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.isRead = !application.isRead;
    await application.save();

    return res.status(200).json({
      success: true,
      message: 'Read status updated',
      data: application
    });
  } catch (error) {
    console.error('Error updating read status:', error);
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