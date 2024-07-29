const express = require("express");
const path = require("path");
const {
	getFeatures,
	createRoom,
	getRoom,
	editRoom,
	getRooms,
} = require("../controllers/rooms");
const { upload } = require("../helpers/file");
const { verifyUserToken } = require("../helpers/auth");
const router = express.Router();

// const multer = require("multer");

const PATH = "/Users/williamkhant/Desktop/Web Project"; //use your own directory of the project folder

// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, "/Users/williamkhant/Desktop/Web Project/public/uploads"); //use your own directory of the project folder
// 	},
// 	filename: function (req, file, cb) {
// 		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// 		cb(null, uniqueSuffix + file.originalname.replace(/\s+/g, "_"));
// 	},
// });
// const upload = multer({ storage: storage });

// html files routes
router.get("/manage_rooms", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/staff/manage_rooms.html"));
});

router.get("/lec_browse_rooms", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/lec/lec_browse_rooms.html"));
});

router.get("/student_browse_rooms", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/student/student_browse_rooms.html"));
});

router.get("/student_room_detail/:id", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/student/student_room_detail.html"));
});

router.get("/lec_room_detail/:id", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/lec/lec_room_detail.html"));
});

router.get("/manage_create_room", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/staff/manage_create_room.html"));
});

router.get("/manage_edit_room/:id", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/staff/manage_edit_room.html"));
});

//api routes
router.get("/api/features", getFeatures);
router.post(
	"/api/room",
	verifyUserToken,
	upload("uploads").array("upload"),
	createRoom,
);
router.get("/api/room/:room_id", getRoom);
router.put(
	"/api/room",
	verifyUserToken,
	upload("uploads").array("upload"),
	editRoom,
);
router.get("/api/rooms", getRooms);

module.exports = router;
