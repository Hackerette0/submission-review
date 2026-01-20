# Submission Review Management System (FSD-11)

## Project Overview
Full-stack system for contributors to submit entries (with max 2 resubmissions) and reviewers to approve/reject them.

## Tech Stack
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Frontend: React, axios, react-router-dom
- Database: MongoDB Atlas

## User Roles & Permissions
- **CONTRIBUTOR**: Register, submit, resubmit (max 2 times), view own submissions
- **REVIEWER**: Login, view all, approve/reject pending submissions

## API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/submissions          (create / resubmit)
- GET /api/submissions/my       (contributor)
- GET /api/submissions          (reviewer)
- PUT /api/submissions/:id/review

## Database Schema
- User: username, password, role
- Submission: contributor, title, description, fileUrl, status, version, submittedAt, reviewedBy, reviewComment

## Live Deployment Links
Frontend: https://your-vercel-app.vercel.app
Backend: https://your-render-app.onrender.com
