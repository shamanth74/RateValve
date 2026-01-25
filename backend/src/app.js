const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const apiRoutes=require('./routes/api.routes');
const analyticsRoutes=require('./routes/analytics.routes');
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api',apiRoutes);
app.use('/admin',analyticsRoutes);
module.exports = app;
