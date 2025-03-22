const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Message = require('../models/Message');
const Case = require('../models/Case');

// Send a message
router.post('/send', authMiddleware, async (req, res) => {
  const { caseId, content } = req.body;

  try {
    const caseDoc = await Case.findById(caseId);
    if (!caseDoc) return res.status(404).json({ message: 'Case not found' });

    const senderId = req.user;
    if (
      caseDoc.citizen.toString() !== senderId &&
      caseDoc.lawyer?.toString() !== senderId
    ) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to message in this case' });
    }

    const message = new Message({
      case: caseId,
      sender: senderId,
      content,
    });

    await message.save();
    res
      .status(201)
      .json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get messages for a case
router.get('/case/:caseId', authMiddleware, async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.caseId);
    if (!caseDoc) return res.status(404).json({ message: 'Case not found' });

    const userId = req.user;
    if (
      caseDoc.citizen.toString() !== userId &&
      caseDoc.lawyer?.toString() !== userId
    ) {
      return res
        .status(403)
        .json({
          message: 'You are not authorized to view messages for this case',
        });
    }

    const messages = await Message.find({ case: req.params.caseId })
      .populate('sender', 'fullName userType')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
