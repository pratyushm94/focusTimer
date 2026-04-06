const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
}

exports.register = async (req, res, next) => { 
try {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }
    if(await User.findOne({ email: email.toLowerCase() })) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    res.status(201).json({ user:{ name: user.name, email: user.email,id: user._id,}, token });
} catch (error) {
    next(error);
}
}

exports.login = async (req, res, next) => {
const { email, password } = req.body;
if(!email || !password) {
    return res.status(400).json({ message: 'Please provide all fields' });
}
const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
if(!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Incorrect email or password' });
}
const token = signToken(user._id);
res.status(200).json({ user:{ name: user.name, email: user.email,id: user._id,}, token });
}

exports.getMe = async (req, res) => {
    res.status(200).json({ user :{ name: req.user.name, email: req.user.email, id: req.user._id }});
}