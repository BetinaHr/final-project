import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';  // Import cookie-parser
import User from './models/User.js';
import jwt from './lib/jwt.js';
import { authMiddleware, isAuth } from './middlewares/authMiddleWare.js';  // Adjust path as needed
import 'dotenv/config';
import { getErrorMessage } from './utils/errowUtils.js';
import { hashPassword, verifyPassword } from './utils/passwordUtils.js'; // Adjust the path as needed

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
    const errorMessage = getErrorMessage(err);
    console.error("Error during registration:", errorMessage);
    res.status(400).json({ error: errorMessage });
  }
});

// Login route
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check if password matches
    const isPasswordValid = await verifyPassword(password, user.password); // Use your helper function
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = await jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_Secret,
      { expiresIn: '1h' }
    );

    // Set the token in the cookie
    res.cookie('AUTH', token, {
      httpOnly: true,  
      // secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,  // 1 hour expiry
      // sameSite: 'Strict',
    });

    // Send success response
    res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    const errorMessage = getErrorMessage(err);
    console.error("Error during login:", errorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout route
app.post('/auth/logout', (req, res) => {
  try {
    // Clear the 'AUTH' cookie
    res.clearCookie('AUTH', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    // Send a success response
    res.status(200).json({ message: 'Logout successful!' });
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
