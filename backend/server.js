require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');

// Render injects PORT dynamically; fall back to 5001 for local dev
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';

// Mongoose connection options
mongoose.set('strictQuery', false);

mongoose
  .connect(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // ── Graceful shutdown ──────────────────────────────────────
    const shutdown = async (signal) => {
      console.log(`\n⚠️  ${signal} received — shutting down gracefully...`);
      server.close(async () => {
        await mongoose.connection.close(false);
        console.log('✅ MongoDB connection closed');
        process.exit(0);
      });
      // Force exit if graceful shutdown takes too long
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
