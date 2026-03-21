const jwt = require('jsonwebtoken');

const JWT_SECRET = 'practical-3';

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
