const Session = require('../models/Session');

exports.createSession = async (req, res, next) => {
  try {
    const { startTime, endTime, durationSeconds, completed, note } = req.body;

    if (!startTime || !endTime || !durationSeconds) {
      return res.status(400).json({ message: 'startTime, endTime and durationSeconds are required' });
    }

    const session = await Session.create({
      userId: req.user._id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      durationSeconds: Math.round(durationSeconds),
      completed: Boolean(completed),
      note: note || '',
    });

    res.status(201).json({ session });
  } catch (err) {
    next(err);
  }
};

exports.getSessions = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      Session.find({ userId: req.user._id })
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Session.countDocuments({ userId: req.user._id }),
    ]);

    res.json({
      sessions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id, // ensure ownership
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session deleted' });
  } catch (err) {
    next(err);
  }
};

exports.deleteAllSessions = async (req, res, next) => {
  try {
    await Session.deleteMany({ userId: req.user._id });
    res.json({ message: 'All sessions deleted' });
  } catch (err) {
    next(err);
  }
};