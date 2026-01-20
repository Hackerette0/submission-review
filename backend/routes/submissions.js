const express = require('express');
const Submission = require('../models/Submission');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Contributor: Create / Resubmit
router.post('/', protect, restrictTo('CONTRIBUTOR'), async (req, res) => {
  try {
    const { title, description, fileUrl, submissionId } = req.body; // submissionId only if resubmitting

    if (submissionId) {
      // Resubmission
      const original = await Submission.findById(submissionId);
      if (!original) return res.status(404).json({ message: 'Submission not found' });
      if (original.contributor.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not your submission' });
      }
      if (original.status === 'APPROVED') {
        return res.status(400).json({ message: 'Approved submissions cannot be resubmitted' });
      }
      if (original.version >= 3) {
        return res.status(400).json({ message: 'Maximum 2 resubmissions allowed (total 3 versions)' });
      }

      const newVersion = new Submission({
        contributor: req.user.id,
        title,
        description,
        fileUrl,
        version: original.version + 1,
        status: 'PENDING'
      });
      await newVersion.save();
      return res.status(201).json(newVersion);
    }

    // First submission
    const submission = new Submission({
      contributor: req.user.id,
      title,
      description,
      fileUrl,
      version: 1
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Contributor: View own submissions
router.get('/my', protect, restrictTo('CONTRIBUTOR'), async (req, res) => {
  const subs = await Submission.find({ contributor: req.user.id })
    .sort({ submittedAt: -1 });
  res.json(subs);
});

// Reviewer: View all submissions
router.get('/', protect, restrictTo('REVIEWER'), async (req, res) => {
  const subs = await Submission.find()
    .populate('contributor', 'username')
    .populate('reviewedBy', 'username')
    .sort({ submittedAt: -1 });
  res.json(subs);
});

// Reviewer: Review (approve / reject)
router.put('/:id/review', protect, restrictTo('REVIEWER'), async (req, res) => {
  try {
    const { status, reviewComment } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Not found' });
    if (sub.status !== 'PENDING') {
      return res.status(400).json({ message: 'Can only review PENDING submissions' });
    }

    sub.status = status;
    sub.reviewedBy = req.user.id;
    sub.reviewComment = reviewComment || '';
    await sub.save();

    res.json(sub);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;