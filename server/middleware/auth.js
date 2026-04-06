const User = require('../models/User');
const jwt = require('jsonwebtoken');
const protect = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No Token' });
    }
    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // add user to request object so that next controller can access and use
        req.user = await User.findById(decoded.id).select('-password'); //added user to request object
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token not valid or expired' });
    }
}

module.exports = { protect };

