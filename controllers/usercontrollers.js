const { default: mongoose } = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.trim() }
            ]
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({ 
                    success: false,
                    message: "Email already exists" 
                });
            }
            if (existingUser.email === email.includes('@gmail.com')) {
                return res.status(400).json({ 
                    success: false,
                    message: "Enter Email correctly exists" 
                });
            }

            if (existingUser.username === username.trim()) {
                return res.status(400).json({ 
                    success: false,
                    message: "Username already exists" 
                });
            }
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Check for numbers, letters, and special characters
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasNumber || !hasLetter || !hasSpecialChar) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least one number, one letter, and one special character"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username: username.trim(),
            email: email.toLowerCase(),
            password: hashedPassword
        });

        // Save user
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }

        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}

const userLogin = async (req, res) => {
    try {
        const { loginId, password } = req.body;

        // Validate input
        if (!loginId || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide login credentials"
            });
        }

        // Find user by email or username
        const existingUser = await User.findOne({
            $or: [
                { email: loginId.toLowerCase() },
                { username: loginId.trim() }
            ]
        });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
          const token=jwt.sign({userId:existingUser._id})
        // Login successful
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { userRegister, userLogin }