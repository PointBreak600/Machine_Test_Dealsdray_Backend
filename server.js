const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

const userRoutes = require('./routes/users');
app.use('/auth', userRoutes);

const employeeRoutes = require('./routes/employees');
app.use('/api/employees', employeeRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});