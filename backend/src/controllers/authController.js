const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const Log = require("../models/Log");
const env = require("../config/env");
const { generateToken } = require("../utils/token");
const { isValidEmail, isAllowedDomain, inferAcademicRole, splitEmail } = require("../utils/validators");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name || user.fullName,
  fullName: user.fullName || user.name,
  email: user.email,
  role: user.role,
  profileType: user.profileType,
  department: user.department,
  batchYear: user.batchYear,
  program: user.program,
  graduationYear: user.graduationYear,
  employeeId: user.employeeId,
  studentId: user.studentId,
  bio: user.bio,
  recoveryQuestion: user.recoveryQuestion,
  verificationStatus: user.verificationStatus,
  verificationDocumentName: user.verificationDocumentName,
  verificationRequestedAt: user.verificationRequestedAt,
  isSuspended: user.isSuspended,
  suspensionType: user.suspensionType,
  suspendedReason: user.suspendedReason,
});

const register = async (req, res) => {
  try {
    const {
      name,
      fullName,
      firstName,
      lastName,
      email,
      password,
      department,
      batchYear,
      program,
      graduationYear,
      employeeId,
      studentId,
      bio,
      recoveryQuestion,
      recoveryAnswer,
    } = req.body;

    const resolvedName = String(
      name || fullName || [firstName, lastName].filter(Boolean).join(" ")
    ).trim();

    if (!resolvedName || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const normalizedEmail = email.toLowerCase();
    const isAdmin = env.adminEmails.includes(normalizedEmail);

    if (!isAdmin && !isAllowedDomain(email, env.allowedDomains)) {
      return res.status(400).json({
        message: "Registration is restricted to approved student, faculty, and alumni domains",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const inferredRole = inferAcademicRole(normalizedEmail);
    const role = isAdmin ? "admin" : inferredRole;
    const recoveryAnswerHash = recoveryAnswer ? await bcrypt.hash(String(recoveryAnswer).trim().toLowerCase(), 10) : "";

    const user = await User.create({
      name: resolvedName,
      fullName: resolvedName,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      profileType: inferredRole,
      department: department || "",
      batchYear: batchYear || "",
      program: program || "",
      graduationYear: graduationYear || "",
      employeeId: employeeId || "",
      studentId: studentId || "",
      bio: bio || "",
      recoveryQuestion: recoveryQuestion || "",
      recoveryAnswerHash,
    });

    await Log.create({
      action: "USER_REGISTERED",
      targetUser: user._id,
      details: `${user.email} | role=${inferredRole}`,
    });

    const token = generateToken({ id: user._id, role: user.role });

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to register user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: "Account is suspended" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    return res.json({
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login" });
  }
};

const getProfile = async (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
};

const updateProfile = async (req, res) => {
  try {
    const { name, fullName, firstName, lastName } = req.body;
    const {
      department,
      batchYear,
      program,
      graduationYear,
      employeeId,
      studentId,
      bio,
      recoveryQuestion,
      recoveryAnswer,
    } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resolvedName = String(name || fullName || [firstName, lastName].filter(Boolean).join(" ") || user.name).trim();
    user.name = resolvedName;
    user.fullName = resolvedName;
    user.department = department ?? user.department;
    user.batchYear = batchYear ?? user.batchYear;
    user.program = program ?? user.program;
    user.graduationYear = graduationYear ?? user.graduationYear;
    user.employeeId = employeeId ?? user.employeeId;
    user.studentId = studentId ?? user.studentId;
    user.bio = bio ?? user.bio;
    user.recoveryQuestion = recoveryQuestion ?? user.recoveryQuestion;
    if (recoveryAnswer) {
      user.recoveryAnswerHash = await bcrypt.hash(String(recoveryAnswer).trim().toLowerCase(), 10);
    }

    if (user.profileType === "student" && !user.studentId) {
      const { localPart } = splitEmail(user.email);
      user.studentId = localPart.toUpperCase();
    }

    await user.save();

    return res.json({ message: "Profile updated", user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to update profile" });
  }
};

const requestOtp = async (req, res) => {
  try {
    const { email, recoveryAnswer } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.recoveryAnswerHash) {
      if (!recoveryAnswer) {
        return res.status(400).json({ message: "Recovery answer is required" });
      }
      const isAnswerValid = await bcrypt.compare(String(recoveryAnswer).trim().toLowerCase(), user.recoveryAnswerHash);
      if (!isAnswerValid) {
        return res.status(401).json({ message: "Incorrect recovery answer" });
      }
    }

    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000);
    const challengeToken = crypto.randomBytes(18).toString("hex");

    console.log(`[OTP] ${user.email}: ${otpCode}`);

    user.otp = { code: otpCode, expiresAt, challengeToken };
    await user.save();

    await Log.create({
      action: "OTP_REQUESTED",
      targetUser: user._id,
      details: `OTP + recovery answer verified, ${env.otpExpiryMinutes} minute expiry`,
    });

    return res.json({
      message: "Recovery challenge verified. OTP generated successfully (simulation)",
      otp: otpCode,
      challengeToken,
      expiresInMinutes: env.otpExpiryMinutes,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate OTP" });
  }
};

const verifyOtpAndResetPassword = async (req, res) => {
  try {
    const { email, otp, challengeToken, newPassword } = req.body;

    if (!email || !otp || !challengeToken || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, challenge token and new password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.otp || !user.otp.code || !user.otp.challengeToken) {
      return res.status(400).json({ message: "OTP not requested" });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otp.expiresAt || user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp.challengeToken !== challengeToken) {
      return res.status(400).json({ message: "Invalid recovery challenge" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = { code: null, expiresAt: null, challengeToken: null };
    await user.save();

    await Log.create({
      action: "PASSWORD_RESET",
      targetUser: user._id,
      details: "Recovery answer + OTP challenge verified",
    });

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to reset password" });
  }
};

const submitVerificationRequest = async (req, res) => {
  try {
    const { department, batchYear, documentName = "" } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.department = department ?? user.department;
    user.batchYear = batchYear ?? user.batchYear;
    user.verificationDocumentName = String(documentName || "").trim();
    user.verificationStatus = "pending";
    user.verificationRequestedAt = new Date();
    await user.save();

    await Log.create({
      action: "VERIFICATION_REQUEST_SUBMITTED",
      actor: user._id,
      targetUser: user._id,
      details: `department=${user.department} | batchYear=${user.batchYear} | doc=${user.verificationDocumentName || "none"}`,
    });

    return res.json({
      message: "Verification request submitted successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit verification request" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  requestOtp,
  verifyOtpAndResetPassword,
  submitVerificationRequest,
};
