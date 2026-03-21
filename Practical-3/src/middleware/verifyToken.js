const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        // console.log(token);
        
        const decoded = jwt.verify(token, 'practical-3');
        // console.log(decoded);
        
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
