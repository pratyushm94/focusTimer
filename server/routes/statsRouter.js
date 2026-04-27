/*The stats endpoint powers the dashboard: today's total, the chart data, and the streak counter.
 It uses MongoDB's aggregation pipeline — a sequence of transformation stages applied to the data.
  The match stage filters by user and date range, group sums durations per day, sort orders
   them, and we fill in any missing days so the chart has a continuous X axis.*/

const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

router.get('/daily', protect, getStats);

module.exports = router;

