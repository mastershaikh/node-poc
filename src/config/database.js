const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://nizamshaikhest:uWqruBtDELK0CXyM@nodepocdb.zlx9ci4.mongodb.net/?retryWrites=true&w=majority&appName=nodepocdb');
};

module.exports = connectDb;