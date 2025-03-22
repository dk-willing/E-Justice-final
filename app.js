const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const messageRoutes = require('./routes/messages');
const paymentRoutes = require('./routes/payments');

dotenv.config({ path: './config.env' });
console.log('Environment Variables Loaded:', process.env.PAYSTACK_SECRET_KEY);

console.log('MONGO_URI:', process.env.DATABSE_LOCAL);
const app = express();
//cors
const cors = require('cors');
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.DATABSE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
