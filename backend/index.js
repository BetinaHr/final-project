import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';  // Import cookie-parser
import User from './models/User.js';
import jwt from './lib/jwt.js';
import { authMiddleware } from './middlewares/authMiddleWare.js';  // Adjust path as needed
import 'dotenv/config';

const app = express();

// Enable CORS with credentials support
app.use(cors({
  origin: 'http://localhost:4200',  // Allow requests from your Angular frontend
  credentials: true,               // Allow credentials (cookies) to be sent
}));

app.use(express.json());
app.use(cookieParser());  // Add cookie-parser middleware to parse cookies
app.use(authMiddleware);  // This will run the authMiddleware on all routes

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/normalUsers', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected.'))
  .catch(err => console.error(err));

// Register route
app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new user instance
    const user = new User({ username, email, password });

    // Save the user (this triggers the pre('save') hook and hashes the password)
    await user.save();

    // Generate JWT token
    const token = await jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_Secret, { expiresIn: '1h' });

    // Set the token in the cookie
    res.cookie('AUTH', token, {
      httpOnly: true,   // This prevents client-side access to the cookie
      secure: process.env.NODE_ENV === 'production',  // Use secure flag in production
      maxAge: 3600000,  // 1 hour expiry
      sameSite: 'Strict', // Ensure the cookie is sent only to the same-site
    });

    // Send response
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(400).json({ error: err.message });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
