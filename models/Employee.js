const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    enum: ['HR', 'Manager', 'Sales']
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  course: {
    type: String,
    required: true,
    enum: ['BCA', 'MCA', 'BSC']
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', EmployeeSchema);