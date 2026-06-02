const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Please try again after 15 minutes.'
});

// Routes
app.use('/api/login', loginLimiter);
app.use('/api', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/inputRoutes'));
app.use('/api/roadmap', require('./routes/roadmapRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Database Connection
const startServer = async () => {
  try {
    // Set a very short timeout for the local connection so it fails fast if missing
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected to local MongoDB');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err.message);
    console.log('Local MongoDB not found. Starting In-Memory MongoDB...');
    try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        console.log(`Connected to In-Memory MongoDB`);
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
    } catch(memErr) {
        console.error('Failed to start in-memory MongoDB:', memErr.message);
    }
  }
};

startServer();
