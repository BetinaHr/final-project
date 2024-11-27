import mongoose from 'mongoose';
import { hashPassword } from '../utils/passwordUtils.js';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required!'],
    minLength: [2, 'Username must be at least 2 characters long!'],
    maxLength: [20, 'Username cannot exceed 20 characters!'],
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    minLength: [10, 'Email must be at least 10 characters long!'],
    validate: {
      validator: (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email),
      message: 'Invalid email format!',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    minLength: [4, 'Password must be at least 4 characters long!'],
  },
});


// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const hashedPassword = await hashPassword(this.password);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

export default User; // Exporting the model correctly
