// src/models/User.js
// Defines the User schema. Password hashing happens here via a
// pre-save hook so that no matter where a User is created/updated
// from in the codebase, the password is never stored in plain text.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never return password by default in queries
    },
  },
  { timestamps: true }
);

// Hash the password before saving, but only if it was actually
// modified (avoids re-hashing an already-hashed password when
// updating other fields like `name`).
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare a plaintext password against the
// stored hash. Keeps bcrypt usage out of the controller layer.
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Strip password (and __v) when the user object is sent as JSON,
// as a second layer of defense beyond `select: false`.
userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);