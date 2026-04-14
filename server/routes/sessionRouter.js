const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  deleteSession,
  deleteAllSessions,
} = require('../controllers/sessionsController');
const { protect } = require('../middleware/auth');

router.use(protect); // all session routes require auth

router.route('/').get(getSessions).post(createSession).delete(deleteAllSessions);
router.delete('/:id', deleteSession);

module.exports = router;