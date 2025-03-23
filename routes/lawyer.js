const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Case = require('../models/Case');

// GET /api/lawyer/performance - Fetch lawyer's performance summary
router.get('/performance', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user || user.role !== 'LAWYER') {
      return res
        .status(403)
        .json({ message: 'Only lawyers can access this endpoint' });
    }

    // Fetch the lawyer's cases
    const cases = await Case.find({ lawyer: req.user });

    // Calculate performance metrics
    const casesHandled = cases.length;
    const activeCases = cases.filter(
      (c) => c.status === 'IN_PROGRESS' || c.status === 'LAWYER_ASSIGNED'
    ).length;
    const resolvedCases = cases.filter((c) => c.status === 'RESOLVED').length;
    const successRate =
      casesHandled > 0 ? Math.round((resolvedCases / casesHandled) * 100) : 0;

    // Mocked metrics for client satisfaction and document processing
    const clientSatisfaction = 92; // Replace with real data if available
    const documentProcessing = 78; // Replace with real data if available
    const scheduledConsultations = 2; // Replace with real data if available

    const summary = {
      casesHandled,
      activeCases,
      successRate,
      clientSatisfaction,
      documentProcessing,
      scheduledConsultations,
    };

    res.json(summary);
  } catch (error) {
    console.error(
      'Error in /api/lawyer/performance:',
      error.message,
      error.stack
    );
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
