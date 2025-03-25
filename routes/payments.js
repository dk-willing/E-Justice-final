const express = require('express');
const router = express.Router();
const axios = require('axios');
const Payment = require('../models/Payment');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Create a Payment Page and Redirect (No authentication required)
router.post('/create-payment-page', async (req, res) => {
  try {
    const { metadata } = req.body;

    // Create a Payment Page using Paystack API
    const paystackResponse = await axios.post(
      `${PAYSTACK_BASE_URL}/page`,
      {
        name: 'Donation Payment Page',
        description: 'Donate to support our cause',
        amount: null, // Set to null to allow users to enter their own amount
        currency: 'GHS',
        redirect_url: '/api/payments/verify', // Callback URL after payment
        metadata: metadata || {},
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!paystackResponse.data.status) {
      throw new Error(
        paystackResponse.data.message || 'Failed to create payment page'
      );
    }

    const paymentPageUrl = `https://paystack.com/pay/${paystackResponse.data.data.slug}`;

    res.status(200).json({
      message: 'Payment page created successfully',
      payment_page_url: paymentPageUrl,
    });
  } catch (error) {
    console.error(
      'Error creating payment page:',
      error.response?.data || error.message
    );
    res.status(500).json({
      message: 'Error creating payment page',
      error: error.message,
      details: error.response ? error.response.data : null,
    });
  }
});

// Verify Payment
router.get('/verify', async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ message: 'Reference is required' });
    }

    // Check if the payment with this reference already exists
    const existingPayment = await Payment.findOne({ reference });
    if (existingPayment) {
      // If the payment already exists, return its details
      return res.status(200).json({
        message: 'Payment already verified',
        paymentDetails: existingPayment,
      });
    }

    // Verify the transaction with Paystack
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

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

    // Payment is successful, save to database
    const paymentDetails = {
      userId: transaction.metadata.userId || null, // Optional userId from metadata
      amount: transaction.amount / 100, // Convert back to GHS
      currency: transaction.currency,
      reference: transaction.reference,
      status: transaction.status,
      paidAt: transaction.paid_at,
      email: transaction.customer.email, // Get the email the user provided to Paystack
    };

    const payment = new Payment(paymentDetails);
    await payment.save();

    // Return JSON response instead of redirecting
    res
      .status(200)
      .json({ message: 'Payment verified successfully', paymentDetails });
  } catch (error) {
    console.error(
      'Error verifying payment:',
      error.response?.data || error.message
    );
    res
      .status(200)
      .send('<h1>THANK YOU!</h1><p>Navigate back to continue<<---</p>');
  }
});

module.exports = router;
