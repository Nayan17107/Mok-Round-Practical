const mongoose = require('mongoose');

const managerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salary: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
}, {
    versionKey: false,
    timestamps: false
});

module.exports = mongoose.model('Manager', managerSchema);
