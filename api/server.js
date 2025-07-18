import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import app from './app.js';

// Connect to database
connectDB();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`,
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`💥 Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
