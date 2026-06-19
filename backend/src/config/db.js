const dns = require('dns');
const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing in .env');
  }

  dns.setServers((process.env.DNS_SERVERS || '8.8.8.8,1.1.1.1').split(','));

  const connection = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB connected: ${connection.connection.host}`);
};

module.exports = connectDB;
