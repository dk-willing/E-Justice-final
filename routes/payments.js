const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const Payment = require('../models/Payment');

const PAYSTACK_API_BASE_URL = 'https://api.paystack.co';

// Initialize a payment transaction
router.post('/initialize', authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const { amount, email, metadata } = req.body;

    // Validate input
    if (!amount || !email) {
      return res.status(400).json({ message: 'Please enter Amount and Email' });
    }
    // Make a direct API call to Paystack to initialize the transaction
    const amountInPesewas = amount * 100;
    const response = await axios.post(
      `${PAYSTACK_API_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amountInPesewas,
        currency: 'GHS',
        callback_url: 'http://localhost:5000/api/payments/verify', // Callback URL after payment
        channels: ['card', 'mobile_money'], // Enable card and mobile money for Ghana
        metadata: metadata || { userId }, // Optional metadata
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Check if the request was successful
    if (!response.data.status) {
      throw new Error(
        response.data.message || 'Failed to initialize transaction'
      );
    }

    res.json({
      message: 'Payment initialized successfully',
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (error) {
    console.error('Error initializing payment:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
    });
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      details: error.response ? error.response.data : null,
    });
  }
});

// Verify a payment transaction
router.get('/verify', async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res
        .status(400)
        .json({ message: 'Transaction reference is required' });
    }

    // Making a direct API call to Paystack to verify the transaction
    const response = await axios.get(
      `${PAYSTACK_API_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Paystack Verify API Response:', response.data);

    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to verify transaction');
    }

    const transaction = response.data.data;

    if (transaction.status !== 'success') {
      return res.status(400).json({
        message: 'Payment verification failed',
        status: transaction.status,
      });
    }

    // Payment is successful
    const paymentDetails = {
      userId: transaction.metadata.userId,
      amount: transaction.amount / 100, // Convert back to GHS
      currency: transaction.currency, // Should be GHS
      reference: transaction.reference,
      status: transaction.status,
      paidAt: transaction.paid_at,
    };

    // Save to database
    const payment = new Payment(paymentDetails);
    await payment.save();

    res.json({ message: 'Payment verified successfully', paymentDetails });
  } catch (error) {
    console.error('Error verifying payment:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
    });
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      details: error.response ? error.response.data : null,
    });
  }
});

module.exports = router;
