'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Schema for a user
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  }
});


UserSchema.virtual('fullName')
  .get(function() {
    return `${this.firstName} ${this.lastName}`;
  });

// Returns the created user with a specific format
UserSchema.methods.apiRepr = function () {
  return { 
    username: this.username, 
    fullName: this.fullName,
    firstName: this.firstName, 
    email: this.email};
};

// Checks if the inputted password matches the encrypted password in the user database
UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Encrypts the user-created password
UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = { User };