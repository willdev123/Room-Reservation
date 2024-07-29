const express = require("express");
const path = require("path");
const router = express.Router();
const { getStats } = require("../controllers/dashboard");
const { getUser, changePassword, editUser } = require("../controllers/user");
const { upload } = require("../helpers/file");

const { verifyUserToken } = require("../helpers/auth");
// const multer = require("multer");

const PATH = "/Users/williamkhant/Desktop/Web Project";

// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, "/Users/williamkhant/Desktop/Web Project/public/profile"); //use your own directory of the project folder
// 	},
// 	filename: function (req, file, cb) {
// 		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// 		cb(null, uniqueSuffix + file.originalname.replace(/\s+/g, "_"));
// 	},
// });
// const upload = multer({ storage: storage });

// html files routes
router.get("/", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/index.html"));
});

router.get("/student_landing", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/student/student_landing.html"));
});

router.get("/student_profile", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/student/student_profile.html"));
});

router.get("/lec_dashboard", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/lec/lec_dashboard.html"));
});

router.get("/lec_profile", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/lec/lec_profile.html"));
});

router.get("/staff_dashboard", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/staff/staff_dashboard.html"));
});

router.get("/staff_profile", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/staff/staff_profile.html"));
});

router.get("/browse_rooms", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/browse_rooms.html"));
});

//api routes

router.get("/api/dashboard", getStats);

router.get("/api/user", verifyUserToken, getUser);
router.put("/api/password", verifyUserToken, changePassword);
router.put(
	"/api/user",
	verifyUserToken,
	upload("profile").single("profile"),
	editUser,
);

module.exports = router;
