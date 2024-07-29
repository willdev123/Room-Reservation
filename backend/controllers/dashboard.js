const db = require("../helpers/db");

const getStats = async (req, res) => {
	const result = [
		{ timeslot: 1, free: 0, pending: 0, reserved: 0, disable: 0 },
		{ timeslot: 2, free: 0, pending: 0, reserved: 0, disable: 0 },
		{ timeslot: 3, free: 0, pending: 0, reserved: 0, disable: 0 },
		{ timeslot: 4, free: 0, pending: 0, reserved: 0, disable: 0 },
		{ total_room_number: 0 },
	];
	const q1 =
		"SELECT timeslot1_status, COUNT(*) AS count FROM room GROUP BY timeslot1_status";
	const q2 =
		"SELECT timeslot2_status, COUNT(*) AS count FROM room GROUP BY timeslot2_status";
	const q3 =
		"SELECT timeslot3_status, COUNT(*) AS count FROM room GROUP BY timeslot3_status";
	const q4 =
		"SELECT timeslot4_status, COUNT(*) AS count FROM room GROUP BY timeslot4_status";
	const q5 = "SELECT COUNT(*) AS total_room_number FROM room";

	try {
		const time_slot1 = await db.query(q1);
		const time_slot2 = await db.query(q2);
		const time_slot3 = await db.query(q3);
		const time_slot4 = await db.query(q4);
		const total_room_number = await db.query(q5);

		time_slot1[0].forEach((time_slot1) => {
			if (time_slot1.timeslot1_status == "free") {
				result[0].free = time_slot1.count;
			} else if (time_slot1.timeslot1_status == "pending") {
				result[0].pending = time_slot1.count;
			} else if (time_slot1.timeslot1_status == "reserved") {
				result[0].reserved = time_slot1.count;
			} else if (time_slot1.timeslot1_status == "disable") {
				result[0].disable = time_slot1.count;
			}
		});

		time_slot2[0].forEach((time_slot2) => {
			if (time_slot2.timeslot2_status == "free") {
				result[1].free = time_slot2.count;
			} else if (time_slot2.timeslot2_status == "pending") {
				result[1].pending = time_slot2.count;
			} else if (time_slot2.timeslot2_status == "reserved") {
				result[1].reserved = time_slot2.count;
			} else if (time_slot2.timeslot2_status == "disable") {
				result[1].disable = time_slot2.count;
			}
		});
		time_slot3[0].forEach((time_slot3) => {
			if (time_slot3.timeslot3_status == "free") {
				result[2].free = time_slot3.count;
			} else if (time_slot3.timeslot3_status == "pending") {
				result[2].pending = time_slot3.count;
			} else if (time_slot3.timeslot3_status == "reserved") {
				result[2].reserved = time_slot3.count;
			} else if (time_slot3.timeslot3_status == "disable") {
				result[2].disable = time_slot3.count;
			}
		});
		time_slot4[0].forEach((time_slot4) => {
			if (time_slot4.timeslot4_status == "free") {
				result[3].free = time_slot4.count;
			} else if (time_slot4.timeslot4_status == "pending") {
				result[3].pending = time_slot4.count;
			} else if (time_slot4.timeslot4_status == "reserved") {
				result[3].reserved = time_slot4.count;
			} else if (time_slot4.timeslot4_status == "disable") {
				result[3].disable = time_slot4.count;
			}
		});

		result[4].total_room_number = total_room_number[0][0].total_room_number;

		return res.status(200).json({
			result,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Server Error!",
		});
	}
};

module.exports = {
	getStats,
};
