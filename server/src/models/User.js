// src/models/User.js
// Defines the User schema. Password hashing happens here via a
// pre-save hook so that no matter where a User is created/updated
// from in the codebase, the password is never stored in plain text.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Email validation regex
const emailRegex =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Strong password validation regex
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=[\]{};':\\|,.<>/?]).{8,}$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        emailRegex,
        'Please provide a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      validate: {
        validator(value) {
          return passwordRegex.test(value);
        },
        message:
          'Password must contain at least 8 characters, including an uppercase letter, lowercase letter, number, and special character.',
      },
      select: false, // Never return password by default
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving, but only if it was actually modified.
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();

  delete obj.password;
  delete obj.__v;

  return obj;
};

module.exports = mongoose.model('User', userSchema);