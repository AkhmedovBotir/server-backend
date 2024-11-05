const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    if (!token) return res.status(401).json({ message: 'Token yo‘q, ruxsat berilmagan' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token noto‘g‘ri' });
    }
};

module.exports = authMiddleware;
