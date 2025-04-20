const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
}, { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;