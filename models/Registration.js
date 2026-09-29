const mongoose = require('mongoose');

// Schema definition for Event Registrations
const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Student email is required'],
    trim: true,
    lowercase: true
  },
  event: {
    type: String,
    required: [true, 'Registered event name is required'],
    trim: true
  },
  year: {
    type: String,
    default: '1st Year'
  },
  department: {
    type: String,
    default: 'CSE'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Registration', registrationSchema);
