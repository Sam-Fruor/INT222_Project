const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    await User.create({
      name, email, password: hashedPassword, role, otp: generatedOtp, isVerified: false
    });

    console.log(`\n📧 NEW EMAIL SIMULATION 📧`);
    console.log(`To: ${email}`);
    console.log(`Subject: Verify your Agri-Chain Account`);
    console.log(`Your Secret OTP Code is: [ ${generatedOtp} ]\n`);

    res.status(201).json({ message: "Account created! Please verify your OTP." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed." });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });
    if (user.otp !== otp) return res.status(400).json({ error: "Invalid OTP code." });

    user.isVerified = true;
    user.otp = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: "Verification successful!", token });
  } catch (error) {
    res.status(500).json({ error: "Verification failed." });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });
    if (!user.isVerified) return res.status(403).json({ error: "Please verify your email first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed." });
  }
};


const getMe = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select('-password -otp'); 
    
    if (!user) return res.status(404).json({ error: "User not found." });

    res.status(200).json(user);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
};

module.exports = { registerUser, verifyOtp, loginUser, getMe };