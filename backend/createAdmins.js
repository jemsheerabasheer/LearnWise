const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // using bcryptjs as required by project deps
const User = require('./models/User');
require('dotenv').config();

const admins = [
  {
    name: 'Admin One',
    email: 'admn1@learnwise.com',
    password: 'admn@123',
    role: 'admin',
    status: 'active'
  },
  {
    name: 'Admin Two',
    email: 'admn2@learnwise.com',
    password: 'admn@123',
    role: 'admin',
    status: 'active'
  },
  {
    name: 'Admin Three',
    email: 'admn3@learnwise.com',
    password: 'admn@123',
    role: 'admin',
    status: 'active'
  }
];

const createAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnwise');
    console.log('Connected to MongoDB');

    for (const admin of admins) {
      const existing = await User.findOne({ 
        email: admin.email 
      });

      if (existing) {
        console.log(`Admin already exists: ${admin.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(admin.password, 10);

      await User.create({
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        createdAt: new Date()
      });

      console.log(`Admin created: ${admin.email}`);
    }

    console.log('All admins created successfully');
    console.log('----------------------------');
    console.log('Admin Credentials:');
    console.log('Email: admn1@learnwise.com');
    console.log('Email: admn2@learnwise.com');
    console.log('Email: admn3@learnwise.com');
    console.log('Password for all: admn@123');
    console.log('----------------------------');
    process.exit(0);

  } catch (error) {
    console.error('Error creating admins:', error);
    process.exit(1);
  }
};

createAdmins();
