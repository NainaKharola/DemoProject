const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const testRoutes = require('./routes/testRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Demo backend API is running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/test', testRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

app.use(errorHandler);

module.exports = app;
