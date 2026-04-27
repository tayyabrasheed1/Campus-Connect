const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
  requestOtp,
  verifyOtpAndResetPassword,
  submitVerificationRequest,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/profile/verify", protect, submitVerificationRequest);
router.post("/recovery/request", requestOtp);
router.post("/recovery/verify", verifyOtpAndResetPassword);

module.exports = router;
