const Manager = require('../model/manager.model');

exports.getAllManagers = async (req, res) => {
    try {
        console.log('getAllManagers called by admin:', req.admin);
        
        const managers = await Manager.find();
        
        if (!managers || managers.length === 0) {
            return res.status(404).json({ message: 'No managers found' });
        }
        
        return res.status(200).json({ message: 'All managers retrieved', data: managers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.updateManager = async (req, res) => {
    try {
        console.log('updateManager called by admin:', req.admin);
        const { managerId } = req.params;
        const { name, email, salary, designation, status } = req.body;

        if (!managerId) {
            return res.status(400).json({ message: 'Manager ID is required' });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (salary !== undefined) updateData.salary = salary;
        if (designation !== undefined) updateData.designation = designation;
        if (status !== undefined) updateData.status = status;
        
        updateData.updated_date = new Date().toISOString();

        const manager = await Manager.findByIdAndUpdate(
            managerId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        return res.status(200).json({ message: 'Manager updated successfully', data: manager });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteManager = async (req, res) => {
    try {
        console.log('deleteManager called by admin:', req.admin);
        const { managerId } = req.params;

        if (!managerId) {
            return res.status(400).json({ message: 'Manager ID is required' });
        }

        const manager = await Manager.findByIdAndDelete(managerId);

        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        return res.status(200).json({ message: 'Manager deleted successfully', data: manager });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.createManager = async (req, res) => {
    try {
        console.log('createManager called by admin:', req.admin);
        const { name, email, salary, designation, status } = req.body;

        if (!name || !email || !salary || !designation || status === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingManager = await Manager.findOne({ email });
        if (existingManager) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const currentDate = new Date().toISOString();
        const manager = await Manager.create({
            name,
            email,
            salary,
            designation,
            status,
            created_date: currentDate,
            updated_date: currentDate
        });

        return res.status(201).json({ message: 'Manager created successfully', data: manager });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
