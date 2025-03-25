const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const messageRoutes = require('./routes/messages');
const paymentRoutes = require('./routes/payments');
const lawyerRoutes = require('./routes/lawyer');
const cors = require('cors');

const app = express();
//cors
app.use(cors());
app.use(express.static(path.join(__dirname, 'client')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/lawyer', lawyerRoutes);

module.exports = app;
