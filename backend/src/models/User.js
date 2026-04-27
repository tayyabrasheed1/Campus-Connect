const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    code: { type: String, default: null },
    expiresAt: { type: Date, default: null },
    challengeToken: { type: String, default: null },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    fullName: { type: String, default: "", trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "faculty", "alumni", "admin"], default: "student" },
    profileType: { type: String, enum: ["student", "faculty", "alumni"], default: "student" },
    department: { type: String, default: "" },
    batchYear: { type: String, default: "" },
    program: { type: String, default: "" },
    graduationYear: { type: String, default: "" },
    employeeId: { type: String, default: "" },
    studentId: { type: String, default: "" },
    bio: { type: String, default: "" },
    recoveryQuestion: { type: String, default: "" },
    recoveryAnswerHash: { type: String, default: "" },
    verificationStatus: { type: String, enum: ["unverified", "pending", "verified", "rejected"], default: "unverified" },
    verificationDocumentName: { type: String, default: "" },
    verificationRequestedAt: { type: Date, default: null },
    isSuspended: { type: Boolean, default: false },
    suspensionType: { type: String, enum: ["none", "temporary", "permanent"], default: "none" },
    suspendedReason: { type: String, default: "" },
    suspendedAt: { type: Date, default: null },
    otp: { type: otpSchema, default: () => ({}) },
  },
  { timestamps: true }
);

userSchema.pre("validate", function syncNameFields(next) {
  if (!this.fullName && this.name) {
    this.fullName = this.name;
  }

  if (!this.name && this.fullName) {
    this.name = this.fullName;
  }

  next();
});

module.exports = mongoose.model("User", userSchema);
