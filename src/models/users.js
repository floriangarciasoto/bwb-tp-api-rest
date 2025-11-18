const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },

    surname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },

    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200
    },

    createdAt: {
        type: Date,
        default: Date.now,
        min: new Date('2000-01-01'),
        max: new Date('2100-01-01')
    }
});

module.exports = mongoose.model('User', userSchema);
