const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
// Registratsiya
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Bu username band' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'Registratsiya muvaffaqiyatli' });
    } catch (error) {
        res.status(500).json({ message: 'Xatolik bor' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Username yoki parol noto\'g\'ri' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Username yoki parol noto\'g\'ri' });

        // Token yaratishda SECRET_KEY ni qo'shamiz
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Tizimga kirildi', token });
    } catch (error) {
        res.status(500).json({ message: 'Xatolik yuz berdi' });
    }
});

router.post('/reset-password', authMiddleware, async (req, res) => {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Yangi parol kiritish va u kamida 6 ta belgidan iborat bo‘lishi kerak' });
    }

    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });

        const hashedPassword = await bcrypt.hash(newPassword, 6);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Parol muvaffaqiyatli yangilandi' });
    } catch (error) {
        res.status(500).json({ message: 'Xatolik yuz berdi' });
    }
});

module.exports = router;
