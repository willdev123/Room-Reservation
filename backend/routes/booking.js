const express = require("express");
const path = require("path");
const router = express.Router();
const { verifyUserToken } = require("../helpers/auth");
const {
	createBooking,
	getBooking,
	getPendingBookings,
	staffBookingHistory,
	lecturerBookingHistory,
	studentBookingHistory,
	bookingDetail,
	validateBooking,
	cancelBooking,
} = require("../controllers/booking");
const { upload } = require("../helpers/file");

const PATH = "/Users/williamkhant/Desktop/Web Project"; //use your own directory of the project folder

// const multer = require("multer");
// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, "/Users/williamkhant/Desktop/Web Project/public/documents"); //use your own directory of the project folder
// 	},
// 	filename: function (req, file, cb) {
// 		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// 		cb(null, uniqueSuffix + file.originalname.replace(/\s+/g, "_"));
// 	},
// // });
// const upload = multer({ storage: storage });
// html files routes
router.get("/check_booking", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/student/check_booking.html"));
});

router.get("/reserve_room/:room_id", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/student/reserve_room.html"));
});

router.get("/student_history", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/student/student_history.html"));
});

router.get("/book_requests", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/lec/book_requests.html"));
});

router.get("/lec_history", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/lec/lec_history.html"));
});

router.get("/reserve_detail/:booking_id", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/lec/reserve_detail.html"));
});

router.get("/staff_history", (_req, res) => {
	res.sendFile(path.join(PATH, "/views/staff/staff_history.html"));
});

//api routes
router.post(
	"/api/booking",
	upload("documents").single("document"),
	verifyUserToken,
	createBooking,
);

router.get("/api/booking", verifyUserToken, getBooking);
//Booking Requests api
router.get("/api/pending_booking", getPendingBookings);

//Staff History api
router.get("/api/staff_booking_history", staffBookingHistory);
//Lecturer History api
router.get(
	"/api/lecturer_booking_history",
	verifyUserToken,
	lecturerBookingHistory,
);
//Student History api
router.get(
	"/api/student_booking_history",
	verifyUserToken,
	studentBookingHistory,
);
// Booking Detail api to show booking info on reserve_detail page
router.get("/api/booking_detail/:booking_id", bookingDetail);

//Booking validation api
router.put("/api/booking_validation", verifyUserToken, validateBooking);

//Cancel pending booking api
router.put("/api/booking_cancel", verifyUserToken, cancelBooking);

module.exports = router;
