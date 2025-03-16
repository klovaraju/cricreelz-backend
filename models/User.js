const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    }
}, {
    timestamps: true
});

// Drop existing indexes before creating new ones
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ username: 1 }, { unique: true, sparse: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
