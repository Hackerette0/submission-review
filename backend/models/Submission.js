const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  contributor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String },               // optional: link or filename
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  version: { type: Number, default: 1 },   // 1 = original, 2 = 1st resubmit, 3 = 2nd resubmit
  submittedAt: { type: Date, default: Date.now },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewComment: { type: String }
});

module.exports = mongoose.model('Submission', submissionSchema);