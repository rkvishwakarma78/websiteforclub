const mongoose = require('mongoose');

// Schema definition for Contact Messages
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sender name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Sender email is required'],
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    default: 'General Inquiry',
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);
