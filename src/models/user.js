const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, minLength: 3, maxLength: 30},
    lastName: {type: String, required: true, minLength: 3, maxLength: 30},
    email: { type: String, unique: true, lowercase: true, required: true, trim: true },
    password: {type: String, required: true},
    age: {
        type: Number,
        validate(value) {
            value >= 13 && value <= 120
        },
        required: true
    },
    gender: {type: String, enum: ['M', 'F', 'O'], default: 'O'},
    photoUrl: {type: String, default: ''},
    shortBio: {type: String, default: ''},
    skills: {type: [String], default: []},
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;