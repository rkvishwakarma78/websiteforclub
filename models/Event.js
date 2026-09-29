const mongoose = require('mongoose');

// Schema definition for NEXORA Club Events
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'Event date is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    default: 'Main Audi / Tech Lab'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
  },
  category: {
    type: String,
    enum: ['Hackathon', 'Workshop', 'Bootcamp', 'Coding', 'Tech Talk', 'General'],
    default: 'General'
  },
  seatsLeft: {
    type: Number,
    default: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
