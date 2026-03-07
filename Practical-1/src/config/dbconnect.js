const mongoose = require('mongoose');

const dbconnection = () => {
    mongoose.connect('mongodb://localhost:27017/Mok-Round-Practical')
    // mongoose.connect("mongodb+srv://Nayan:nayan%402006@cluster0.smklzxg.mongodb.net/Mok-Round-Practical")
        .then(() => console.log('DB is connected!!!!'))
        .catch(err => console.log(err))
}

module.exports = dbconnection;