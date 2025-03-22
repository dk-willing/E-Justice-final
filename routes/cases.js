const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Case = require('../models/Case');
const User = require('../models/User');
const upload = require('../middleware/upload');

// Create a new case (Citizen only)
router.post('/create', authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  try {
    const user = await User.findById(req.user);
    if (!user || user.userType !== 'CITIZEN') {
      return res
        .status(403)
        .json({ message: 'Only citizens can create cases' });
    }

    const newCase = new Case({
      title,
      description,
      citizen: req.user,
    });

    await newCase.save();
    res
      .status(201)
      .json({ message: 'Case created successfully', case: newCase });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all cases for the logged-in user (Citizen or Lawyer)
router.get('/my-cases', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let cases;
    if (user.userType === 'CITIZEN') {
      cases = await Case.find({ citizen: req.user }).populate(
        'lawyer',
        'fullName specialization'
      );
    } else if (user.userType === 'LAWYER') {
      cases = await Case.find({ lawyer: req.user }).populate(
        'citizen',
        'fullName'
      );
    }

    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign a lawyer to a case
router.put('/assign/:caseId', authMiddleware, async (req, res) => {
  const { lawyerId } = req.body;

  try {
    const caseDoc = await Case.findById(req.params.caseId);
    if (!caseDoc) return res.status(404).json({ message: 'Case not found' });

    const lawyer = await User.findById(lawyerId);
    if (!lawyer || lawyer.userType !== 'LAWYER' || !lawyer.isVerified) {
      return res.status(400).json({ message: 'Invalid or unverified lawyer' });
    }

    // For now, anyone can assign; later, restrict to admins
    caseDoc.lawyer = lawyerId;
    caseDoc.status = 'LAWYER_ASSIGNED';
    await caseDoc.save();

    res.json({ message: 'Lawyer assigned successfully', case: caseDoc });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update case status
router.put('/update-status/:caseId', authMiddleware, async (req, res) => {
  const { status } = req.body;

  try {
    const caseDoc = await Case.findById(req.params.caseId);
    if (!caseDoc) return res.status(404).json({ message: 'Case not found' });

    const user = await User.findById(req.user);
    if (user.userType === 'LAWYER' && caseDoc.lawyer.toString() !== req.user) {
      return res
        .status(403)
        .json({ message: 'Only the assigned lawyer can update this case' });
    }

    if (
      !['SUBMITTED', 'LAWYER_ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].includes(
        status
      )
    ) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    caseDoc.status = status;
    await caseDoc.save();

    res.json({ message: 'Case status updated successfully', case: caseDoc });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload a document to a case
router.post(
  '/upload-document/:caseId',
  authMiddleware,
  upload.single('document'),
  async (req, res) => {
    try {
      const caseDoc = await Case.findById(req.params.caseId);
      if (!caseDoc) return res.status(404).json({ message: 'Case not found' });

      const userId = req.user;
      if (
        caseDoc.citizen.toString() !== userId &&
        caseDoc.lawyer?.toString() !== userId
      ) {
        return res.status(403).json({
          message: 'You are not authorized to upload documents to this case',
        });
      }

      if (!req.file)
        return res.status(400).json({ message: 'No file uploaded' });

      const document = {
        name: req.file.originalname,
        path: req.file.path,
        uploadedBy: userId,
      };

      caseDoc.documents.push(document);
      await caseDoc.save();

      res
        .status(201)
        .json({ message: 'Document uploaded successfully', document });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Get documents for a case
router.get('/documents/:caseId', authMiddleware, async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.caseId).populate(
      'documents.uploadedBy',
      'fullName userType'
    );
    if (!caseDoc) return res.status(404).json({ message: 'Case not found' });

    const userId = req.user;
    if (
      caseDoc.citizen.toString() !== userId &&
      caseDoc.lawyer?.toString() !== userId
    ) {
      return res.status(403).json({
        message: 'You are not authorized to view documents for this case',
      });
    }

    res.json(caseDoc.documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
