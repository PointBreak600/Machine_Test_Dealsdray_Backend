const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware = require('../middleware/auth');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
  
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Create new user
    const user = new User({
        username,
        password: hashedPassword,
    });
  
    try {
        const newUser = await user.save();
        res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/verify', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({ username: user.username });
});


module.exports = router;