const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Route Imports
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const activityRoutes = require('./routes/activityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const templateRoutes = require('./routes/templateRoutes');
const projectRoutes = require('./routes/projectRoutes');
const broadcastRoutes = require('./routes/broadcastRoutes');
const jobRoutes = require('./routes/jobRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const eventRoutes = require('./routes/eventRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const offerLetterRoutes = require('./routes/offerLetterRoutes');

// DB Config
const connectDB = require('./config/db');

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect DB (handles both Main and Student DBs if configured)
connectDB();

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/broadcast', broadcastRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/offer-letter', offerLetterRoutes);

app.get('/', (req, res) => {
    res.send('PaulTech Software Services API is running');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Attendance Auto-Checkout Controller
const { autoCloseUnpunchedAttendance } = require('./controllers/attendanceController');

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Initial check on server start
    autoCloseUnpunchedAttendance();

    // Periodic 7:00 PM Auto Punch-OUT task: runs every 60 seconds
    setInterval(() => {
        autoCloseUnpunchedAttendance();
    }, 60 * 1000);
});
