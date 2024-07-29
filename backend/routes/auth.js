const express = require("express");
const path = require("path");
const router = express.Router();
const {
	verifyEmailToken,
	verfiyForgetPasswordToken,
	verifyUserToken,
} = require("../helpers/auth");

const {
	login,
	register,
	verifyEmail,
	forgetPassword,
	setNewPassword,
	sendVeriEmail,
} = require("../controllers/auth");

const PATH = "/Users/williamkhant/Desktop/Web Project";

// html files routes
router.get("/login", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/auth/login.html"));
});

router.get("/register", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/auth/register.html"));
});

router.get("/email_verification/:token", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/auth/email_verification.html"));
});

router.get("/invalid_user", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/auth/invalid_user.html"));
});

router.get("/invalid_token", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/auth/invalid_token.html"));
});

router.get("/forget_password", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/auth/forget_password.html"));
});

router.get("/new_password/:token", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/auth/new_password.html"));
});

//api routes
router.post("/api/login", login);
router.post("/api/register", register);
router.post("/api/verify_email", verifyEmailToken, verifyEmail);
router.post("/api/forget_password", forgetPassword);
router.post("/api/new_password", verfiyForgetPasswordToken, setNewPassword);
router.post("/api/profile/verify_email", verifyUserToken, sendVeriEmail);

module.exports = router;
