const mongoose = require('mongoose');

const dbconnection = () => {
    mongoose.connect('mongodb://localhost:27017/Practical-3')
    // mongoose.connect("mongodb+srv://Nayan:nayan%402006@cluster0.smklzxg.mongodb.net/Practical-3")
        .then(() => console.log('DB is connected!!!!'))
        .catch(err => console.log(err))
}

module.exports = dbconnection;