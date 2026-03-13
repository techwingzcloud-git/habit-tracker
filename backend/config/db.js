import mongoose from 'mongoose';
import dns from 'dns';

// Force Google DNS so MongoDB SRV records resolve correctly
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    // Pass credentials separately to avoid URI special-character encoding issues
    const conn = await mongoose.connect(
      `mongodb+srv://habitflow.g4fbaaj.mongodb.net/habittracker?retryWrites=true&w=majority&appName=habitflow`,
      {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASS,
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
      }
    );
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
