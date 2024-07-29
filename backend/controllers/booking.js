const db = require("../helpers/db");
const fs = require("fs");

const createBooking = async (req, res) => {
	const student_id = req.user.id;
	let file = null;
	const { room_id, timeslot, request_note, reason } = req.body;
	const q1 =
		"SELECT * from booking WHERE DATE(booking_date) = CURDATE() AND (status = 'pending' OR status = 'approved' OR status = 'disapproved') and student_id = ?";
	const q2 =
		"INSERT INTO booking (student_id, room_id, time_slot, reason, request_note, document) VALUES (?, ?, ?, ?, ?, ?)";

	const q3 = "UPDATE room SET timeslot1_status = 'pending' WHERE id = ?";
	const q4 = "UPDATE room SET timeslot2_status = 'pending' WHERE id = ?";
	const q5 = "UPDATE room SET timeslot3_status = 'pending' WHERE id = ?";
	const q6 = "UPDATE room SET timeslot4_status = 'pending' WHERE id = ?";
	const q7 = "SELECT * FROM user WHERE id = ?";

	try {
		const user = await db.query(q7, [student_id]);

		console.log(user[0][0].isVerified);
		if (user[0][0].isVerified == 0) {
			return res.status(400).json({
				message: "Your account have not verified yet!",
			});
		}

		const bookings = await db.query(q1, [student_id]);

		if (bookings[0].length > 0) {
			if (req.file != undefined) {
				fs.unlinkSync(req.file.path);
			}
			return res.status(400).json({
				message: "You already have a booking for today",
			});
		}

		if (req.file != undefined) {
			file = req.file.path.slice(req.file.path.indexOf("/public"));
		}

		await db.query(q2, [
			student_id,
			room_id,
			timeslot,
			request_note,
			reason,
			file,
		]);

		if (timeslot == "1") {
			await db.query(q3, [room_id]);
		} else if (timeslot == "2") {
			await db.query(q4, [room_id]);
		} else if (timeslot == "3") {
			await db.query(q5, [room_id]);
		} else if (timeslot == "4") {
			await db.query(q6, [room_id]);
		}

		return res.status(200).json({
			message: "Room booked successfully!",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Server Error!",
		});
	}
};

const getBooking = async (req, res) => {
	const result = {};
	const student_id = req.user.id;

	const q =
		"SELECT booking.id AS booking_id, booking.room_id, booking.student_id, room.room_type, room.room_number, room.building_number, room.capacity, booking.status, booking.time_slot, booking.note, user.username AS validator FROM booking LEFT JOIN room ON booking.room_id = room.id LEFT JOIN user ON booking.validator_id = user.id LEFT JOIN room_image ON booking.room_id = room_image.room_id WHERE booking.booking_date = ( SELECT MAX(booking.booking_date) from booking WHERE DATE(booking.booking_date) = CURDATE() AND booking.student_id = ?) AND booking.student_id = ?;";
	const q1 =
		"SELECT id, room_id, path AS image from room_image WHERE room_id = ?";

	try {
		const booking = await db.query(q, [student_id, student_id]);

		if (booking[0].length < 1) {
			return res.status(404).json({
				message: "No booking to show!",
			});
		}

		const images = await db.query(q1, [booking[0][0].room_id]);
		if (images[0].length > 0) {
			booking[0][0].images = images[0];
		} else {
			booking[0][0].images = [];
		}

		if (booking[0][0].time_slot == "1") {
			booking[0][0].time_slot = "08:00-10:00 AM";
		} else if (booking[0][0].time_slot == "2") {
			booking[0][0].time_slot = "10:00-12:00 AM";
		} else if (booking[0][0].time_slot == "3") {
			booking[0][0].time_slot = "12:00-14:00 PM";
		} else if (booking[0][0].time_slot == "4") {
			booking[0][0].time_slot = "14:00-16:00 PM";
		}

		return res.status(200).json({
			result: booking[0][0],
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Server Error!",
		});
	}
};

const getPendingBookings = async (req, res) => {
	const q =
		"WITH RoomsWithFirstImage AS (SELECT room_image.room_id, room_image.id, room_image.path, ROW_NUMBER() OVER (PARTITION BY room_image.room_id ORDER BY room_image.id) AS image_rank FROM room_image) SELECT b.id as booking_id, CAST(b.booking_date AS TIME) AS booking_time, b.time_slot AS timeslot, b.status, b.student_id AS booking_student_id, b.room_id AS booking_room_id, r.room_type, r.room_number, r.building_number, r.capacity, u.username AS student, ri.id AS image_id, ri.path AS image FROM booking b INNER JOIN room r ON b.room_id = r.id INNER JOIN user u ON b.student_id = u.id LEFT JOIN RoomsWithFirstImage ri ON r.id = ri.room_id WHERE COALESCE(ri.image_rank, 1) = 1 AND status = 'pending' AND DATE(b.booking_date) = CURDATE() ORDER BY b.booking_date DESC;";

	try {
		const bookings = await db.query(q);

		if (bookings[0].length < 1) {
			return res.status(404).json({
				message: "No pending bookings yet for today",
			});
		}

		bookings[0].forEach((booking) => {
			if (booking.timeslot == "1") {
				booking.timeslot = "08:00-10:00 AM";
			} else if (booking.timeslot == "2") {
				booking.timeslot = "10:00-12:00 AM";
			} else if (booking.timeslot == "3") {
				booking.timeslot = "12:00-14:00 PM";
			} else if (booking.timeslot == "4") {
				booking.timeslot = "14:00-16:00 PM";
			}
		});

		bookings[0].forEach((booking) => {
			if (booking.image == null) {
				booking.image = "/public/uploads/no-pictures.png";
			}
		});

		return res.status(200).json({
			result: bookings[0],
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Server Error!",
		});
	}
};

const bookingDetail = async (req, res) => {
	const booking_id = req.params.booking_id;

	const q =
		"SELECT room_id, request_note, reason, time_slot, document from booking WHERE id = ?";
	try {
		const booking = await db.query(q, [booking_id]);
		if (booking[0].length < 1) {
			return res.status(404).json({
				message: "Invalid booking!",
			});
		}
		if (booking[0][0].time_slot == "1") {
			booking[0][0].time_slot = "08:00-10:00 AM";
		} else if (booking[0][0].time_slot == "2") {
			booking[0][0].time_slot = "10:00-12:00 AM";
		} else if (booking[0][0].time_slot == "3") {
			booking[0][0].time_slot = "12:00-14:00 PM";
		} else if (booking[0][0].time_slot == "4") {
			booking[0][0].time_slot = "14:00-16:00 PM";
		}
		return res.status(200).json({
			result: booking[0][0],
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Server Error!",
		});
	}
};

const validateBooking = async (req, res) => {
	console.log(req.body);
	const validator_id = req.user.id;
	const { booking_id, note, validation } = req.body;

	const q1 = "SELECT * FROM booking WHERE id = ?";
	const q2 =
		"UPDATE booking SET validator_id = ?, validated_date = NOW(), note = ?, status = ? WHERE id = ?";
	const q3 = "UPDATE room SET timeslot1_status = 'reserved' WHERE id = ?";
	const q4 = "UPDATE room SET timeslot2_status = 'reserved' WHERE id = ?";
	const q5 = "UPDATE room SET timeslot3_status = 'reserved' WHERE id = ?";
	const q6 = "UPDATE room SET timeslot4_status = 'reserved' WHERE id = ?";
	const q7 = "UPDATE room SET timeslot1_status = 'free' WHERE id = ?";
	const q8 = "UPDATE room SET timeslot2_status = 'free' WHERE id = ?";
	const q9 = "UPDATE room SET timeslot3_status = 'free' WHERE id = ?";
	const q10 = "UPDATE room SET timeslot4_status = 'free' WHERE id = ?";

	try {
		const booking = await db.query(q1, [booking_id]);
		if (booking[0].length > 1) {
			if (booking[0][0].status == "approved") {
				return res.status(400).json({
					message: "This booking has already been approved",
				});
			} else if (booking[0][0].status == "disapproved") {
				return res.status(400).json({
					message: "This booking has already been disapproved",
				});
			} else if (booking[0][0].status == "canceled") {
				return res.status(400).json({
					message: "This booking has already been canceled",
				});
			}
		}

		await db.query(q2, [validator_id, note, validation, booking_id]);

		if (validation == "approved") {
			if (booking[0][0].time_slot == "1") {
				await db.query(q3, [booking[0][0].room_id]);
			} else if (booking[0][0].time_slot == "2") {
				await db.query(q4, [booking[0][0].room_id]);
			} else if (booking[0][0].time_slot == "3") {
				await db.query(q5, [booking[0][0].room_id]);
			} else if (booking[0][0].time_slot == "4") {
				await db.query(q6, [booking[0][0].room_id]);
			}
		}

		if (validation == "disapproved") {
			if (booking[0][0].time_slot == "1") {
				await db.query(q7, [booking[0][0].room_id]);
			} else if (booking[0][0].time_slot == "2") {
				await db.query(q8, [booking[0][0].room_id]);
			} else if (booking[0][0].time_slot == "3") {
				await db.query(q9, [booking[0][0].room_id]);
			} else if (booking[0][0].time_slot == "4") {
				await db.query(q10, [booking[0][0].room_id]);
			}
		}
		res.status(201).json({
			message: "Validated successfully!",
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Server Error!",
		});
	}
};

// Start from here
const staffBookingHistory = async (req, res) => {
	//get only approved or disapproved  booking but not pending ordered by descending with booking_date
	const { filter, startDate, endDate } = req.query;
	let approved_param = "approved";
	let disapproved_param = "disapproved";

	if (filter == "approved") {
		disapproved_param = null;
	}

	if (filter == "disapproved") {
		approved_param = null;
	}
	console.log(startDate, endDate, approved_param, disapproved_param);

	const q =
		"WITH RoomsWithFirstImage AS (SELECT room_image.room_id, room_image.id, room_image.path, ROW_NUMBER() OVER (PARTITION BY room_image.room_id ORDER BY room_image.id) AS image_rank FROM room_image) SELECT b.id as booking_id, DATE_FORMAT(b.booking_date, '%D %M, %Y %r') AS booking_date, DATE_FORMAT(b.validated_date, '%D %M, %Y %r') AS validated_date, b.time_slot AS timeslot, b.note, b.status, b.student_id AS booking_student_id, b.validator_id AS booking_validator_id, b.room_id AS booking_room_id, r.room_type, r.room_number, r.building_number, r.capacity, us.username AS student, uv.username AS validator, ri.id AS image_id, ri.path AS image FROM booking b INNER JOIN room r ON b.room_id = r.id INNER JOIN user us ON b.student_id = us.id INNER JOIN user uv ON b.validator_id = uv.id LEFT JOIN RoomsWithFirstImage ri ON r.id = ri.room_id WHERE COALESCE(ri.image_rank, 1) = 1 AND status IN (? , ?) AND DATE(booking_date) >= ? AND DATE(booking_date) <= ? ORDER BY b.booking_date DESC;";

	try {
		const bookings = await db.query(q, [
			approved_param,
			disapproved_param,
			startDate,
			endDate,
		]);
		if (bookings[0].length < 1) {
			return res.status(404).json({
				message: "No bookings to show!",
			});
		}

		bookings[0].forEach((booking) => {
			if (booking.timeslot == "1") {
				booking.timeslot = "08:00-10:00 AM";
			} else if (booking.timeslot == "2") {
				booking.timeslot = "10:00-12:00 AM";
			} else if (booking.timeslot == "3") {
				booking.timeslot = "12:00-14:00 PM";
			} else if (booking.timeslot == "4") {
				booking.timeslot = "14:00-16:00 PM";
			}
		});

		bookings[0].forEach((booking) => {
			if (booking.image == null) {
				booking.image = "/public/uploads/no-pictures.png";
			}
		});

		return res.status(200).json({
			result: bookings[0],
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Server Error!",
		});
	}
};

const lecturerBookingHistory = async (req, res) => {
	//get only approved or dispproved booking but not pending ordered by descending with booking_date
	//get booking history of the specific lecturer
	const lecturer_id = req.user.id; //use this in query
	const { filter, startDate, endDate } = req.query;
	let approved_param = "approved";
	let disapproved_param = "disapproved";

	if (filter == "approved") {
		disapproved_param = null;
	}

	if (filter == "disapproved") {
		approved_param = null;
	}

	//get only approved or disapproved  booking but not pending ordered by descending with booking_date
	const q =
		"WITH RoomsWithFirstImage AS (SELECT room_image.room_id, room_image.id, room_image.path, ROW_NUMBER() OVER (PARTITION BY room_image.room_id ORDER BY room_image.id) AS image_rank FROM room_image) SELECT b.id as booking_id, DATE_FORMAT(b.booking_date, '%D %M, %Y %r') AS booking_date, DATE_FORMAT(b.validated_date, '%D %M, %Y %r') AS validated_date, b.time_slot AS timeslot, b.note, b.status, b.student_id AS booking_student_id, b.room_id AS booking_room_id, r.room_type, r.room_number, r.building_number, r.capacity, u.username AS student, ri.id AS image_id, ri.path AS image FROM booking b INNER JOIN room r ON b.room_id = r.id INNER JOIN user u ON b.student_id = u.id LEFT JOIN RoomsWithFirstImage ri ON r.id = ri.room_id WHERE COALESCE(ri.image_rank, 1) = 1 AND status IN (? , ?) AND DATE(booking_date) >= ? AND DATE(booking_date) <= ? AND b.validator_id = ? ORDER BY b.booking_date DESC;";

	try {
		const bookings = await db.query(q, [
			approved_param,
			disapproved_param,
			startDate,
			endDate,
			lecturer_id,
		]);
		if (bookings[0].length < 1) {
			return res.status(404).json({
				message: "No bookings to show!",
			});
		}

		bookings[0].forEach((booking) => {
			if (booking.timeslot == "1") {
				booking.timeslot = "08:00-10:00 AM";
			} else if (booking.timeslot == "2") {
				booking.timeslot = "10:00-12:00 AM";
			} else if (booking.timeslot == "3") {
				booking.timeslot = "12:00-14:00 PM";
			} else if (booking.timeslot == "4") {
				booking.timeslot = "14:00-16:00 PM";
			}
		});

		bookings[0].forEach((booking) => {
			if (booking.image == null) {
				booking.image = "/public/uploads/no-pictures.png";
			}
		});

		return res.status(200).json({
			result: bookings[0],
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Server Error!",
		});
	}
};

const studentBookingHistory = async (req, res) => {
	//get only approved or dispproved  booking but not pending ordered by descending with booking_date
	//get booking history of the specific student
	const student_id = req.user.id; //use this in query
	const { filter, startDate, endDate } = req.query;
	let approved_param = "approved";
	let disapproved_param = "disapproved";

	if (filter == "approved") {
		disapproved_param = null;
	}

	if (filter == "disapproved") {
		approved_param = null;
	}
	const q =
		"WITH RoomsWithFirstImage AS (SELECT room_image.room_id, room_image.id, room_image.path, ROW_NUMBER() OVER (PARTITION BY room_image.room_id ORDER BY room_image.id) AS image_rank FROM room_image) SELECT b.id as booking_id, DATE_FORMAT(b.booking_date, '%D %M, %Y %r') AS booking_date, DATE_FORMAT(b.validated_date, '%D %M, %Y %r') AS validated_date, b.note, b.time_slot AS timeslot, b.status, b.validator_id AS booking_validator_id, b.room_id AS booking_room_id, r.room_type, r.room_number, r.building_number, r.capacity, u.username AS validator, ri.id AS image_id, ri.path AS image FROM booking b INNER JOIN room r ON b.room_id = r.id INNER JOIN user u ON b.validator_id = u.id LEFT JOIN RoomsWithFirstImage ri ON r.id = ri.room_id WHERE COALESCE(ri.image_rank, 1) = 1 AND status IN (? , ?) AND DATE(booking_date) >= ? AND DATE(booking_date) <= ? AND b.student_id = ? ORDER BY b.booking_date DESC;";

	try {
		const bookings = await db.query(q, [
			approved_param,
			disapproved_param,
			startDate,
			endDate,
			student_id,
		]);
		if (bookings[0].length < 1) {
			return res.status(404).json({
				message: "No bookings to show!",
			});
		}

		bookings[0].forEach((booking) => {
			if (booking.timeslot == "1") {
				booking.timeslot = "08:00-10:00 AM";
			} else if (booking.timeslot == "2") {
				booking.timeslot = "10:00-12:00 AM";
			} else if (booking.timeslot == "3") {
				booking.timeslot = "12:00-14:00 PM";
			} else if (booking.timeslot == "4") {
				booking.timeslot = "14:00-16:00 PM";
			}
		});

		bookings[0].forEach((booking) => {
			if (booking.image == null) {
				booking.image = "/public/uploads/no-pictures.png";
			}
		});

		return res.status(200).json({
			result: bookings[0],
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Server Error!",
		});
	}
};

const cancelBooking = async (req, res) => {
	console.log(req.body);
	const student_id = req.user.id;
	const booking_id = req.body.booking_id;
	const q1 =
		"SELECT student_id, status, time_slot, room_id FROM booking WHERE id = ?";
	const q2 = "UPDATE booking SET status = 'canceled' WHERE id = ?";
	const q3 = "UPDATE room SET timeslot1_status = 'free' WHERE id = ?";
	const q4 = "UPDATE room SET timeslot2_status = 'free' WHERE id = ?";
	const q5 = "UPDATE room SET timeslot3_status = 'free' WHERE id = ?";
	const q6 = "UPDATE room SET timeslot4_status = 'free' WHERE id = ?";
	try {
		const booking = await db.query(q1, [booking_id]);
		if (booking[0][0].status != "pending") {
			return res.status(400).json({
				message: `${booking[0][0].status} booking cannot be canceled`,
			});
		}

		if (booking[0][0].student_id !== student_id) {
			return res.status(400).json({
				message: `Unauthorized user to cancel!`,
			});
		}

		console.log(booking[0][0]);

		await db.query(q2, [booking_id]);
		if (booking[0][0].time_slot == "1") {
			await db.query(q3, [booking[0][0].room_id]);
		} else if (booking[0][0].time_slot == "2") {
			await db.query(q4, [booking[0][0].room_id]);
		} else if (booking[0][0].time_slot == "3") {
			await db.query(q5, [booking[0][0].room_id]);
		} else if (booking[0][0].time_slot == "4") {
			await db.query(q6, [booking[0][0].room_id]);
		}

		return res.status(201).json({
			message: "Booking canceled successfully!",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Server Error!",
		});
	}
};

module.exports = {
	createBooking,
	getBooking,
	getPendingBookings,
	staffBookingHistory,
	lecturerBookingHistory,
	studentBookingHistory,
	bookingDetail,
	validateBooking,
	cancelBooking,
};
