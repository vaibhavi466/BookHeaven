const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MongoDB connection string is missing. Set MONGO_URI in .env');
    }
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
