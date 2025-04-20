const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // lưu user id vào request để dùng sau này
        next();
    } catch (error) {
        console.error('Lỗi xác minh Token:', error.message);
        return res.status(403).json({ message: 'Forbidden' });
    }
}

module.exports = authMiddleware;