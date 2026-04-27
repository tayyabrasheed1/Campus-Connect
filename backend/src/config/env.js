const dotenv = require("dotenv");

dotenv.config();

const toList = (value) =>
  (value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

const studentDomains = toList(process.env.STUDENT_DOMAINS || "szabist-isb.edu.pk");
const facultyDomains = toList(process.env.FACULTY_DOMAINS || "faculty.szabist-isb.edu.pk");
const alumniDomains = toList(process.env.ALUMNI_DOMAINS || "alumni.szabist-isb.edu.pk");

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus_connect",
  jwtSecret: process.env.JWT_SECRET || "replace_this_with_secure_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  otpExpiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES) || 10,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  adminEmails: toList(process.env.ADMIN_EMAILS),
  studentDomains,
  facultyDomains,
  alumniDomains,
  allowedDomains: Array.from(new Set([...studentDomains, ...facultyDomains, ...alumniDomains])),
  facultyEmailHints: toList(process.env.FACULTY_EMAIL_HINTS || "faculty,prof,lecturer,hod"),
  alumniEmailHints: toList(process.env.ALUMNI_EMAIL_HINTS || "alumni,grad"),
};
