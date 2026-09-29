const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexora_db';

// Track database connection status
let isDbConnected = false;

// In-memory fallback storage in case local MongoDB is not running yet
let memoryEvents = [
  {
    _id: '1',
    title: 'NEXORA HACK 2026',
    category: 'Hackathon',
    date: 'Oct 24 - 25, 2026',
    location: 'Main Auditorium & Innovation Hub',
    seatsLeft: 42,
    description: 'The flagship 24-hour national hackathon. Build groundbreaking AI, Web3, and Web solutions with mentorship, swag, and exciting cash prizes.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: '2',
    title: 'Web Development Workshop',
    category: 'Workshop',
    date: 'Nov 02, 2026',
    location: 'Lab 402, CS Department',
    seatsLeft: 18,
    description: 'Master modern full-stack web architecture with HTML5, CSS3, Vanilla JS, Node.js and Express. Hands-on coding session.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: '3',
    title: 'AI & ML Bootcamp',
    category: 'Bootcamp',
    date: 'Nov 12, 2026',
    location: 'Seminar Hall 1',
    seatsLeft: 25,
    description: 'Explore generative AI models, deep learning concepts, and practical computer vision implementations using Python.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: '4',
    title: 'CodeSprint 2026',
    category: 'Coding',
    date: 'Nov 20, 2026',
    location: 'Online Contest Portal',
    seatsLeft: 80,
    description: 'A speed-coding contest challenging your algorithmic thinking, data structures knowledge, and problem-solving agility.',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: '5',
    title: 'Tech Talk: Future of Cybersecurity',
    category: 'Tech Talk',
    date: 'Dec 05, 2026',
    location: 'Virtual Zoom / Main Hall',
    seatsLeft: 60,
    description: 'Industry keynote on zero-trust architecture, ethical penetration testing, and protecting critical infrastructure.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: '6',
    title: 'UI/UX Design Masterclass',
    category: 'Workshop',
    date: 'Dec 18, 2026',
    location: 'Design Studio Lab',
    seatsLeft: 30,
    description: 'Learn modern wireframing, design systems, glassmorphism aesthetics, micro-interactions, and Figma workflows.',
    image: 'https://images.unsplash.com/photo-1581291518655-9523c932deda?auto=format&fit=crop&w=800&q=80'
  }
];

let memoryRegistrations = [];
let memoryContacts = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 3000
  })
  .then(async () => {
    isDbConnected = true;
    console.log(' Successfully connected to MongoDB Database.');
    await seedInitialEvents();
  })
  .catch((err) => {
    isDbConnected = false;
    console.warn(' MongoDB connection note:', err.message);
    console.log(' Running with smart in-memory data store so all APIs, events, registrations & forms work flawlessly.');
  });

// Seed default events into MongoDB if empty
async function seedInitialEvents() {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      console.log(' Seeding initial sample events into MongoDB...');
      await Event.insertMany(memoryEvents.map(({ _id, ...rest }) => rest));
      console.log(' Initial events seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding initial events:', err.message);
  }
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 1. GET /api/events - Retrieve all events
app.get('/api/events', async (req, res) => {
  try {
    if (isDbConnected) {
      const events = await Event.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: events.length, data: events });
    }
    return res.status(200).json({ success: true, count: memoryEvents.length, data: memoryEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching events' });
  }
});

// 2. POST /api/events - Create a new event
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, location, image, category, seatsLeft } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and date'
      });
    }

    const eventPayload = {
      title,
      description,
      date,
      location: location || 'NEXORA Tech Lab',
      image: image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      category: category || 'General',
      seatsLeft: seatsLeft ? Number(seatsLeft) : 50
    };

    if (isDbConnected) {
      const newEvent = await Event.create(eventPayload);
      return res.status(201).json({ success: true, message: 'Event created successfully', data: newEvent });
    }

    const memoryNewEvent = { _id: Date.now().toString(), ...eventPayload, createdAt: new Date() };
    memoryEvents.unshift(memoryNewEvent);
    return res.status(201).json({ success: true, message: 'Event created successfully', data: memoryNewEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, message: 'Server error while creating event' });
  }
});

// 3. DELETE /api/events/:id - Delete an event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected) {
      const deletedEvent = await Event.findByIdAndDelete(id);
      if (!deletedEvent) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      return res.status(200).json({ success: true, message: 'Event deleted successfully' });
    }

    const initialLength = memoryEvents.length;
    memoryEvents = memoryEvents.filter((ev) => ev._id !== id);
    if (memoryEvents.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting event' });
  }
});

// 4. POST /api/register - Register a student for an event
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, event, year, department } = req.body;

    if (!name || !email || !event) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and event name are required.'
      });
    }

    const registrationData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      event: event.trim(),
      year: year || '1st Year',
      department: department || 'CSE',
      createdAt: new Date()
    };

    if (isDbConnected) {
      const savedRegistration = await Registration.create(registrationData);
      return res.status(201).json({
        success: true,
        message: 'Registration Successful!',
        data: savedRegistration
      });
    }

    const memoryReg = { _id: Date.now().toString(), ...registrationData };
    memoryRegistrations.push(memoryReg);
    return res.status(201).json({
      success: true,
      message: 'Registration Successful!',
      data: memoryReg
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing registration.'
    });
  }
});

// 5. GET /api/registrations - View all registrations (for admin/demo)
app.get('/api/registrations', async (req, res) => {
  try {
    if (isDbConnected) {
      const registrations = await Registration.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: registrations.length, data: registrations });
    }
    return res.status(200).json({ success: true, count: memoryRegistrations.length, data: memoryRegistrations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching registrations' });
  }
});

// 6. POST /api/contact - Receive a message from contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message.'
      });
    }

    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      createdAt: new Date()
    };

    if (isDbConnected) {
      const savedContact = await Contact.create(contactData);
      return res.status(201).json({
        success: true,
        message: 'Message sent successfully!',
        data: savedContact
      });
    }

    const memoryMsg = { _id: Date.now().toString(), ...contactData };
    memoryContacts.push(memoryMsg);
    return res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: memoryMsg
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending contact message.'
    });
  }
});

// 7. GET /api/contacts - View all contact inquiries (for admin/demo)
app.get('/api/contacts', async (req, res) => {
  try {
    if (isDbConnected) {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: contacts.length, data: contacts });
    }
    return res.status(200).json({ success: true, count: memoryContacts.length, data: memoryContacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching contact messages' });
  }
});

// 8. GET /api/status - System status & statistics
app.get('/api/status', (req, res) => {
  res.status(200).json({
    club: 'NEXORA',
    tagline: 'CREATE. INNOVATE. INSPIRE.',
    status: 'ONLINE',
    database: isDbConnected ? 'MongoDB Connected' : 'In-Memory Fallback Active',
    timestamp: new Date().toISOString()
  });
});

// Fallback route for SPA / Direct Page Access
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Express Server (only when not running inside Vercel serverless environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 NEXORA College Tech Club Portal is Live!`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`📚 Database Status: ${isDbConnected ? 'MongoDB' : 'Initializing/In-Memory'}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
