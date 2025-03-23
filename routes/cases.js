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
    if (!user || user.role !== 'CITIZEN') {
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
    console.error('Error in /api/cases/create:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all cases for the logged-in user (Citizen or Lawyer)
router.get('/my-cases', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let cases;
    if (user.role === 'CITIZEN') {
      cases = await Case.find({ citizen: req.user }).populate(
        'lawyer',
        'name specialization'
      );
    } else if (user.role === 'LAWYER') {
      cases = await Case.find({ lawyer: req.user }).populate('citizen', 'name');
    }

    res.json(cases);
  } catch (error) {
    console.error('Error in /api/cases/my-cases:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get cases assigned to the logged-in lawyer (for lawyer dashboard)
router.get('/lawyer', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'LAWYER') {
      return res
        .status(403)
        .json({ message: 'Only lawyers can access this endpoint' });
    }

    const cases = await Case.find({ lawyer: req.user }).populate(
      'citizen',
      'name'
    );
    // Format the response to match what the frontend expects
    const formattedCases = cases.map((caseItem) => ({
      _id: caseItem._id,
      title: caseItem.title,
      startDate: caseItem.createdAt || new Date(), // Use createdAt if startDate isn't a field
      progress: caseItem.progress || 0, // Add progress field if it exists in your Case model
      type: caseItem.type || 'Civil Progress', // Add a type field (mocked if not in model)
    }));

    res.json({ cases: formattedCases });
  } catch (error) {
    console.error('Error in /api/cases/lawyer:', error.message, error.stack);
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
    if (!lawyer || lawyer.role !== 'LAWYER' || !lawyer.isVerified) {
      return res.status(400).json({ message: 'Invalid or unverified lawyer' });
    }

    caseDoc.lawyer = lawyerId;
    caseDoc.status = 'LAWYER_ASSIGNED';
    await caseDoc.save();

    res.json({ message: 'Lawyer assigned successfully', case: caseDoc });
  } catch (error) {
    console.error(
      'Error in /api/cases/assign/:caseId:',
      error.message,
      error.stack
    );
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
    if (user.role === 'LAWYER' && caseDoc.lawyer?.toString() !== req.user) {
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
    console.error(
      'Error in /api/cases/update-status/:caseId:',
      error.message,
      error.stack
    );
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
      console.error(
        'Error in /api/cases/upload-document/:caseId:',
        error.message,
        error.stack
      );
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Get documents for a case
router.get('/documents/:caseId', authMiddleware, async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.caseId).populate(
      'documents.uploadedBy',
      'name role'
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
    console.error(
      'Error in /api/cases/documents/:caseId:',
      error.message,
      error.stack
    );
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's cases (alternative endpoint, can be removed if not needed)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cases = await Case.find({ userId: req.user }).populate(
      'lawyer',
      'name profileImage'
    );
    res.json({ cases });
  } catch (error) {
    console.error('Error in /api/cases:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit a new case (alternative endpoint, can be removed if not needed)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: 'Title and description are required' });
    }

    const newCase = new Case({
      title,
      description,
      userId: req.user,
      status: 'In Progress',
      progress: 0,
    });

    await newCase.save();
    res
      .status(201)
      .json({ message: 'Case submitted successfully', case: newCase });
  } catch (error) {
    console.error('Error in /api/cases (POST):', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
