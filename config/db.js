const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("WARNING: MONGO_URI is missing. Set it in Vercel environment variables.");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // DO NOT process.exit(1) on Vercel, as it causes 500 FUNCTION_INVOCATION_FAILED
  }
};

module.exports = connectDB;
