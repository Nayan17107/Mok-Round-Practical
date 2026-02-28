const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const secret = process.env.JWT_SECRET || 'change_this_secret';
        const decoded = jwt.verify(token, secret);
        
        req.admin = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
