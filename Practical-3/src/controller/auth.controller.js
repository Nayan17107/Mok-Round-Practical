const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            confirm_password,
            conform_password
        } = req.body;
        
        // console.log(req.body);

        const confirmedPassword = confirm_password ?? conform_password;

        if (!username || !email || !password || !confirmedPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password !== confirmedPassword) {
            return res.status(400).json({ message: 'Password and confirm password must match' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const hashConformPassword = await bcrypt.hash(confirmedPassword, 12);

        const user = await User.create({
            username,
            email,
            password: hashPassword,
            conform_password: hashConformPassword
        });

        return res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(req.body);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
            id: user._id,
            email: user.email,
            username: user.username
        };

        const token = jwt.sign(payload, 'practical-3', { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful', token, user: payload });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
