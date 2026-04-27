const Session = require('../models/Session');


exports.getStats = async function (req, res, next) {
    try {
        const days = Math.min(90, Math.max(7, parseInt(req.query.days) || 30)); // min 7 days, max 90 days
        const userid = req.user._id;

        // set date and time from which the session stats needs to be calculated
        const since = new Date();
        since.setDate(since.getDate() - days);
        since.setHours(0, 0, 0, 0);

        //Aggregation, group by local date and sum durations for each day 
        const dailyAgg = await Session.aggregate([
            {
                $match: {
                    userId,
                    startTime: { $gte: since }
                },
            },
            {
                $group: {
                    // group by start time in local date
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$startTime'
                        }
                    },
                    totalSeconds: { $sum: '$durationSeconds' },
                    sessionCount: { $sum: 1 },
                    completedCount: { $sum: { $cond: ['$completed', 1, 0] } }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
        // Today's totals
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayData = dailyAgg.find((d) => d._id === todayStr) || {
      totalSeconds: 0,
      sessionCount: 0,
    };

    // Fill in missing dates so chart has a continuous x-axis
    const filled = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const found = dailyAgg.find((x) => x._id === dateStr);
      filled.push({
        date: dateStr,
        totalSeconds: found ? found.totalSeconds : 0,
        totalMinutes: found ? Math.round(found.totalSeconds / 60) : 0,
        sessionCount: found ? found.sessionCount : 0,
      });
    }

    // Streak calculation (consecutive days with at least 1 session)
    let streak = 0;
    for (let i = filled.length - 1; i >= 0; i--) {
      if (filled[i].sessionCount > 0) streak++;
      else break;
    }

    // All-time totals
    const allTime = await Session.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalSeconds: { $sum: '$durationSeconds' },
          totalSessions: { $sum: 1 },
        },
      },
    ]);

    res.json({
      today: {
        totalSeconds: todayData.totalSeconds,
        totalMinutes: Math.round(todayData.totalSeconds / 60),
        sessionCount: todayData.sessionCount,
      },
      chart: filled,
      streak,
      allTime: allTime[0]
        ? {
            totalSeconds: allTime[0].totalSeconds,
            totalSessions: allTime[0].totalSessions,
          }
        : { totalSeconds: 0, totalSessions: 0 },
    });

    }catch(err){
        next(err);
    }
}