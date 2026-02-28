const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    conform_password: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);
