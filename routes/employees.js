const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({ storage: storage });

router.get('/', authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', authMiddleware, getEmployee, (req, res) => {
  res.json(res.employee);
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const employee = new Employee({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    designation: req.body.designation,
    gender: req.body.gender,
    course: req.body.course,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
  });

  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    if(err.code === 11000) {
        res.status(400).json({ message: 'Email already exists' });
    } else {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
  }
});

router.patch('/:id', authMiddleware, getEmployee, upload.single('image'), async (req, res) => {
  const { name, email, mobile, designation, gender, course } = req.body;
  const employeeId = req.params.id;

  if (email) {
    const existingEmployee = await Employee.findOne({ email, _id: { $ne: employeeId } });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email already exists' });
    }
  }

  if (name != null) {
    res.employee.name = name;
  }
  if (email != null) {
    res.employee.email = email;
  }
  if (mobile != null) {
    res.employee.mobile = mobile;
  }
  if (designation != null) {
    res.employee.designation = designation;
  }
  if (gender != null) {
    res.employee.gender = gender;
  }
  if (course != null) {
    res.employee.course = course;
  }
  if (req.file) {
    res.employee.imageUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const updatedEmployee = await res.employee.save();
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, getEmployee, async (req, res) => {
  try {
    await res.employee.deleteOne();
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

async function getEmployee(req, res, next) {
  let employee;
  try {
    employee = await Employee.findById(req.params.id);
    if (employee == null) {
      return res.status(404).json({ message: 'Employee not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.employee = employee;
  next();
}

module.exports = router;