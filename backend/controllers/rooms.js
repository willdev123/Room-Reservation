const db = require("../helpers/db");
const fs = require("fs");

const getFeatures = async (req, res) => {
	const q = "SELECT * from feature";
	const features = [];

	try {
		const res_features = await db.query(q);

		res_features[0].forEach((f) => {
			features.push(f);
		});

		return res.status(200).json({
			features,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Server Error!",
		});
	}
};

const createRoom = async (req, res) => {
	const q1 =
		"INSERT INTO room (room_type, room_number, building_number, capacity, lat, lng) VALUES (?, ?, ?, ?, ?, ?)";
	const q2 = "SELECT id from room WHERE room_number = ?";
	const q3 = "INSERT INTO room_feature (room_id, feature_id) VALUES ?";
	const q4 = "INSERT INTO room_image (room_id, path) VALUES ?";
	const q5 = "SELECT * from room WHERE room_number = ?";

	const {
		room_type,
		room_number,
		building_number,
		capacity,
		lat,
		lng,
		features_body,
	} = req.body;

	try {
		//Check if room_number is empty
		if (!room_number) {
			req.files.forEach((file) => {
				fs.unlinkSync(file.path);
			});

			return res.status(400).json({
				message: "Room number must not be empty!",
			});
		}

		// Check if the room already exists
		const room = await db.query(q5, [room_number]);
		if (room[0].length > 0) {
			req.files.forEach((file) => {
				fs.unlinkSync(file.path);
			});
			return res.status(400).json({
				message: "Same room already existed!",
			});
		}

		//Insert room data
		await db.query(q1, [
			room_type,
			room_number,
			building_number,
			capacity,
			lat,
			lng,
		]);

		//Get id of newly inserted room
		const room_id = await db.query(q2, [room_number]);

		//Insert feaures into room_feature table if feature data is included
		if (features_body) {
			const room_feature_ids = [];
			features_body.split(",").forEach((f) => {
				room_feature_ids.push([room_id[0][0].id, parseInt(f)]);
			});
			await db.query(q3, [room_feature_ids]);
		}

		//Insert data into room_image table if img data is included
		if (req.files.length > 0) {
			const room_images = [];
			req.files.forEach((file) => {
				room_images.push([
					room_id[0][0].id,
					file.path.slice(file.path.indexOf("/public")),
				]);
			});
			await db.query(q4, [room_images]);
		}

		return res.status(201).json({
			message: "Room created successfully!",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Server Error!",
		});
	}
};

const getRoom = async (req, res) => {
	const room_id = req.params.room_id;
	const q1 = "SELECT * FROM room WHERE id = ?";
	const q2 = "SELECT feature_id FROM room_feature WHERE room_id= ?";
	const q3 =
		"SELECT path FROM room INNER JOIN room_image ON room.id = room_image.room_id WHERE room.id = ?";
	let features = [];
	let images = [];
	let result = {};

	try {
		const room_details = await db.query(q1, [room_id]);
		Object.assign(result, room_details[0][0]);

		const feature_ids = await db.query(q2, [room_id]);

		const room_images = await db.query(q3, [room_id]);

		if (feature_ids[0].length > 0) {
			feature_ids[0].forEach((feature) => {
				features.push(feature.feature_id);
			});
		}

		if (room_images[0].length > 0) {
			room_images[0].forEach((image) => {
				images.push(image.path);
			});
		}

		Object.assign(result, { features });
		Object.assign(result, { images });
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

const editRoom = async (req, res) => {
	const q1 =
		"UPDATE room SET room_type = ?, room_number = ?, building_number = ?, capacity = ?, lat = ?, lng = ? WHERE id = ?";
	const q2 = "DELETE FROM room_feature WHERE room_id = ?";
	const q3 = "INSERT INTO room_feature (room_id, feature_id) VALUES ?";
	const q4 = "SELECT path from room_image WHERE room_id = ?";
	const q5 = "DELETE from room_image WHERE room_id = ?";
	const q6 = "SELECT * from room WHERE id = ?";
	const q7 = "UPDATE room SET timeslot1_status = 'disable' WHERE id = ?";
	const q8 = "UPDATE room SET timeslot2_status = 'disable' WHERE id = ?";
	const q9 = "UPDATE room SET timeslot3_status = 'disable' WHERE id = ?";
	const q10 = "UPDATE room SET timeslot4_status = 'disable' WHERE id = ?";
	const q11 = "INSERT INTO room_image (room_id, path) VALUES ?";
	const q12 = "SELECT * from room WHERE room_number = ?";
	const {
		room_id,
		room_type,
		room_number,
		building_number,
		capacity,
		lat,
		lng,
		features_body,
		slots_body,
		deleteImages,
	} = req.body;

	try {
		//Check if room_number is empty
		if (!room_number) {
			req.files.forEach((file) => {
				fs.unlinkSync(file.path);
			});

			return res.status(400).json({
				message: "Room number must not be empty!",
			});
		}

		// Check if the room exists
		const room = await db.query(q6, [room_id]);
		if (room[0].length == 0) {
			req.files.forEach((file) => {
				fs.unlinkSync(file.path);
			});
			return res.status(400).json({
				message: "No room found to edit!",
			});
		}
		// Check if the edit_room number already exists
		const res_room_number = await db.query(q12, [room_number]);
		if (res_room_number[0].length > 0) {
			if (res_room_number[0][0].id != room_id) {
				req.files.forEach((file) => {
					fs.unlinkSync(file.path);
				});
				return res.status(400).json({
					message: "Same room already existed!",
				});
			}
		}

		//Update room data
		await db.query(q1, [
			room_type,
			room_number,
			building_number,
			capacity,
			lat,
			lng,
			room_id,
		]);

		//Update room time slots status
		if (slots_body) {
			const slots_to_disable = [];
			slots_body.split(",").forEach((slot) => {
				slots_to_disable.push(slot);
			});
			slots_to_disable.forEach(async (d_slot) => {
				if (d_slot == "timeslot1_status") {
					await db.query(q7, [room_id]);
				} else if (d_slot == "timeslot2_status") {
					await db.query(q8, [room_id]);
				} else if (d_slot == "timeslot3_status") {
					await db.query(q9, [room_id]);
				} else {
					await db.query(q10, [room_id]);
				}
			});
		}
		//Delete all features of the room first
		db.query(q2, [room_id]);

		//Insert features again into room_feature table if new or old or same or any features  is included
		if (features_body) {
			const room_feature_ids = [];
			features_body.split(",").forEach((f) => {
				room_feature_ids.push([room_id, parseInt(f)]);
			});
			console.log(room_feature_ids);
			await db.query(q3, [room_feature_ids]);
		}

		//Delete Images
		if (deleteImages == "true") {
			const images_to_delete = [];

			//Select images from db to delete in uploads folder
			const images = await db.query(q4, [room_id]);
			images[0].forEach((image) => {
				images_to_delete.push(image.path);
			});

			//delete images in upload folder first
			images_to_delete.forEach((d_img) => {
				fs.unlinkSync("/Users/williamkhant/Desktop/Web Project" + d_img);
			});

			//delete images in db
			await db.query(q5, [room_id]);
		}

		//Insert images into room_image table if img data is included
		if (req.files.length > 0) {
			const room_images = [];
			req.files.forEach((file) => {
				room_images.push([
					room_id,
					file.path.slice(file.path.indexOf("/public")),
				]);
			});
			await db.query(q11, [room_images]);
		}

		return res.status(201).json({
			message: "Room edited sucessfully!",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Server Error!",
		});
	}
};

const getRooms = async (req, res) => {
	const page = parseInt(req.query.page);
	const limit = parseInt(req.query.limit);
	let room_type = req.query.room_type;
	let room_number = req.query.room_number;

	const offset = (page - 1) * limit;
	const end = page * limit;

	const result = {};

	const q =
		"WITH RoomsWithImages AS (SELECT r.id as room_id, r.room_type, r.room_number, r.building_number, r.capacity, r.timeslot1_status,  r.timeslot2_status, r.timeslot3_status, r.timeslot4_status, ri.id as image_id, ri.path AS image, ROW_NUMBER() OVER (PARTITION BY r.id ORDER BY ri.id) AS image_rank FROM room r LEFT JOIN room_image ri ON r.id = ri.room_id) SELECT room_id AS id, room_type, room_number, building_number, capacity, timeslot1_status, timeslot2_status, timeslot3_status, timeslot4_status, image_id, image FROM RoomsWithImages WHERE  image_rank = 1 AND room_type LIKE ? AND room_number LIKE ? ORDER BY room_id DESC LIMIT ? OFFSET ? ;";
	const q2 = "SELECT * FROM room WHERE room_type LIKE ? AND room_number LIKE ?";

	try {
		const rooms = await db.query(q, [
			`%${room_type}%`,
			`%${room_number}%`,
			parseInt(limit),
			offset,
		]);
		if (rooms[0].length < 1) {
			return res.status(404).json({
				message: "No rooms found!",
			});
		}

		rooms[0].forEach((room) => {
			if (room.image == null) {
				room.image = "/public/uploads/no-pictures.png";
			}
		});
		Object.assign(result, { result: rooms[0] });

		if (offset > 0) {
			Object.assign(result, {
				previous: {
					page: page - 1,
					limit: limit,
				},
			});
		} else {
			Object.assign(result, {
				previous: false,
			});
		}

		const allrooms = await db.query(q2, [`%${room_type}%`, `%${room_number}%`]);

		if (end < allrooms[0].length) {
			Object.assign(result, {
				next: {
					page: page + 1,
					limit: limit,
				},
			});
		} else {
			Object.assign(result, {
				next: false,
			});
		}

		return res.status(200).json(result);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Server Error!",
		});
	}
};

module.exports = { getFeatures, createRoom, getRoom, editRoom, getRooms };
