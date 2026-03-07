const Admin = require('../model/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.addadmin = async (req, res) => {
    try {
        console.log('addadmin request body:', req.body);
        const {
            username,
            email,
            password,
            conform_password,
            confirm_password,
            status
        } = req.body;

        const confirmedPassword = conform_password ?? confirm_password;
        const normalizedStatus =
            typeof status === 'string' ? status.toLowerCase() === 'true' : status;

        if (
            username === undefined ||
            email === undefined ||
            password === undefined ||
            confirmedPassword === undefined ||
            normalizedStatus === undefined
        ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password !== confirmedPassword) {
            return res.status(400).json({ message: 'Password and confirm password must match' });
        }

        if (typeof normalizedStatus !== 'boolean') {
            return res.status(400).json({ message: 'Status must be boolean true/false' });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const hashConformPassword = await bcrypt.hash(confirmedPassword, 12);

        const admin = await Admin.create({
            username,
            email,
            password: hashPassword,
            conform_password: hashConformPassword,
            status: normalizedStatus
        });

        return res.status(201).json({ message: 'Admin added', admin });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        console.log('login request body:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
            id: admin._id,
            email: admin.email,
            username: admin.username
        };

        const secret = process.env.JWT_SECRET || 'change_this_secret';
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        const safeAdmin = {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            status: admin.status,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt
        };

        return res.status(200).json({ message: 'Login successful', token, admin: safeAdmin });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
